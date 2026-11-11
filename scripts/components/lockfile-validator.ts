import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { EOL } from 'os';

/**
 * A node of a parsed Yarn (berry) lockfile. Like Yarn's own `parseSyml`
 * (which parses with the YAML failsafe schema), every scalar is kept as a string.
 */
export type LockfileNode = string | { [key: string]: LockfileNode };

export type LockfileViolation = {
  kind: 'parse' | 'type' | 'localhost';
  path: string;
  message: string;
};

const RECOVERY_INSTRUCTIONS = [
  'This usually means packages were resolved through the local Verdaccio registry (e.g. while running `yarn vend` or e2e tests).',
  'To recover:',
  '  1. stop the proxy: `yarn stop:npm-proxy`',
  '  2. make sure no local registry is configured: `yarn config get npmRegistryServer` must print https://registry.npmjs.org/ and `npm config get registry` must not point to localhost',
  '  3. restore and regenerate the lockfile: `git checkout origin/main -- yarn.lock && yarn install`',
  '  4. commit the result',
].join(EOL);

/**
 * Hosts that indicate the lockfile or config was produced against a local registry.
 */
const isLoopbackHost = (rawHost: string): boolean => {
  const host = rawHost.toLowerCase().replace(/\.$/, '');
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    /^127(\.\d{1,3}){3}$/.test(host) ||
    host === '0.0.0.0' ||
    host === '[::1]' ||
    host === '[::]'
  );
};

/**
 * Lockfile values are frequently URL-encoded, sometimes more than once (e.g. an
 * `__archiveUrl` nested inside a `patch:` locator), so decode until stable.
 */
const fullyDecode = (value: string): string => {
  let current = value;
  for (let i = 0; i < 5; i++) {
    let next: string;
    try {
      next = decodeURIComponent(current);
    } catch {
      return current;
    }
    if (next === current) {
      return current;
    }
    current = next;
  }
  return current;
};

// scheme://[userinfo@]host[:port][/path] — the host is captured (IPv6 literals in brackets)
const URL_PATTERN =
  /[a-z][a-z0-9+.-]*:\/\/(?:[^/\s"'@?#]*@)?(\[[^\]\s]*\]|[^/\s"':?#]+)[^\s"'#]*/gi;

/**
 * Returns the loopback references contained in the given value: URLs whose host
 * is a loopback address, or a value that is itself a loopback host (optionally with a port).
 *
 * Package names that merely contain "localhost" (e.g. `is-localhost-ip@npm:2.0.0`) are not reported.
 */
export const findLoopbackReferences = (value: string): string[] => {
  const decoded = fullyDecode(value);
  const references: string[] = [];
  for (const match of decoded.matchAll(URL_PATTERN)) {
    if (isLoopbackHost(match[1])) {
      references.push(match[0]);
    }
  }
  const bareHost = decoded.trim().replace(/:\d+$/, '');
  if (references.length === 0 && isLoopbackHost(bareHost)) {
    references.push(decoded.trim());
  }
  return references;
};

/**
 * Reads a key at the start of `text`. Keys are either bare or JSON-style double-quoted strings.
 * @returns the key and the remainder of the line after the key.
 */
const readKey = (
  text: string,
  lineNumber: number,
): { key: string; rest: string } => {
  if (text.startsWith('"')) {
    let end = 1;
    while (end < text.length && text[end] !== '"') {
      end += text[end] === '\\' ? 2 : 1;
    }
    if (end >= text.length) {
      throw new Error(`line ${lineNumber}: unterminated quoted key`);
    }
    let key: unknown;
    try {
      key = JSON.parse(text.slice(0, end + 1));
    } catch {
      throw new Error(`line ${lineNumber}: invalid quoted key`);
    }
    return { key: key as string, rest: text.slice(end + 1) };
  }
  const colon = text.indexOf(':');
  if (colon === -1) {
    throw new Error(`line ${lineNumber}: expected "key: value"`);
  }
  return { key: text.slice(0, colon), rest: text.slice(colon) };
};

/**
 * Parses a Yarn berry lockfile (the "syml" format written by `yarn install`).
 *
 * Yarn writes lockfiles in a strict, YAML-compatible subset: two-space indentation,
 * bare or double-quoted keys, bare or double-quoted scalar values, and nested mappings.
 * This parser accepts exactly that subset and throws on anything else, so a malformed
 * or hand-edited lockfile fails the check instead of being silently skipped.
 */
export const parseYarnLockfile = (
  content: string,
): Record<string, LockfileNode> => {
  const root: Record<string, LockfileNode> = {};
  // stack[depth] is the mapping that receives keys indented by `depth * 2` spaces
  const stack: Array<Record<string, LockfileNode>> = [root];
  // a mapping opened by the previous line that must receive at least one key
  let openMapping: { key: string; lineNumber: number } | undefined;

  content.split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      return;
    }
    if (line.includes('\t')) {
      throw new Error(`line ${lineNumber}: tabs are not allowed`);
    }
    const indent = line.length - line.trimStart().length;
    const depth = indent / 2;
    if (!Number.isInteger(depth) || depth > stack.length - 1) {
      throw new Error(
        `line ${lineNumber}: unexpected indentation of ${indent} spaces`,
      );
    }
    if (openMapping && depth !== stack.length - 1) {
      throw new Error(
        `line ${openMapping.lineNumber}: ${JSON.stringify(openMapping.key)} has no value`,
      );
    }
    openMapping = undefined;
    stack.length = depth + 1;
    const target = stack[depth];

    const { key, rest } = readKey(trimmed, lineNumber);
    if (!rest.startsWith(':')) {
      throw new Error(
        `line ${lineNumber}: expected ":" after key ${JSON.stringify(key)}`,
      );
    }
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      throw new Error(
        `line ${lineNumber}: duplicate key ${JSON.stringify(key)}`,
      );
    }

    const rawValue = rest.slice(1);
    if (rawValue === '') {
      const child: Record<string, LockfileNode> = {};
      target[key] = child;
      stack.push(child);
      openMapping = { key, lineNumber };
      return;
    }
    if (!rawValue.startsWith(' ')) {
      throw new Error(
        `line ${lineNumber}: expected a space after ":" for key ${JSON.stringify(key)}`,
      );
    }
    const valueText = rawValue.trim();
    if (valueText.startsWith('"')) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(valueText);
      } catch {
        throw new Error(
          `line ${lineNumber}: invalid quoted value for key ${JSON.stringify(key)}`,
        );
      }
      target[key] = parsed as string;
      return;
    }
    // YAML indicators that Yarn never emits unquoted (flow collections, anchors, tags, block scalars, ...)
    if (/^[[\]{}&*!|>'%@`,-]/.test(valueText)) {
      throw new Error(
        `line ${lineNumber}: unsupported value ${JSON.stringify(valueText)} for key ${JSON.stringify(key)}`,
      );
    }
    target[key] = valueText;
  });

  if (openMapping) {
    throw new Error(
      `line ${openMapping.lineNumber}: ${JSON.stringify(openMapping.key)} has no value`,
    );
  }
  return root;
};

type FieldType = 'string' | 'stringMap' | 'metaMap';

/**
 * Expected value types of the fields Yarn writes for each lockfile entry.
 * Unknown fields are allowed (newer Yarn versions may add some) but are still scanned for localhost references.
 */
const ENTRY_FIELDS: Record<string, { type: FieldType; required: boolean }> = {
  version: { type: 'string', required: true },
  resolution: { type: 'string', required: true },
  languageName: { type: 'string', required: true },
  linkType: { type: 'string', required: true },
  checksum: { type: 'string', required: false },
  conditions: { type: 'string', required: false },
  dependencies: { type: 'stringMap', required: false },
  peerDependencies: { type: 'stringMap', required: false },
  bin: { type: 'stringMap', required: false },
  dependenciesMeta: { type: 'metaMap', required: false },
  peerDependenciesMeta: { type: 'metaMap', required: false },
};

const isMapping = (
  node: LockfileNode | undefined,
): node is Record<string, LockfileNode> =>
  typeof node === 'object' && node !== null;

const typeViolation = (path: string, message: string): LockfileViolation => ({
  kind: 'type',
  path,
  message,
});

const validateType = (
  path: string,
  node: LockfileNode,
  type: FieldType,
): LockfileViolation[] => {
  if (type === 'string') {
    return typeof node === 'string'
      ? []
      : [typeViolation(path, `${path} must be a string, got a mapping`)];
  }
  if (!isMapping(node)) {
    return [typeViolation(path, `${path} must be a mapping, got a string`)];
  }
  // stringMap: { [name]: string }, metaMap: { [name]: { [flag]: string } }
  return Object.entries(node).flatMap(([key, value]) =>
    validateType(
      `${path}.${key}`,
      value,
      type === 'stringMap' ? 'string' : 'stringMap',
    ),
  );
};

/**
 * Validates the shape and value types of a parsed lockfile.
 */
export const validateLockfileStructure = (
  lockfile: Record<string, LockfileNode>,
): LockfileViolation[] => {
  const violations: LockfileViolation[] = [];

  const metadata = lockfile.__metadata;
  if (!isMapping(metadata)) {
    violations.push(
      typeViolation(
        '__metadata',
        '__metadata must be present and be a mapping',
      ),
    );
  } else {
    if (
      typeof metadata.version !== 'string' ||
      !/^\d+$/.test(metadata.version)
    ) {
      violations.push(
        typeViolation(
          '__metadata.version',
          '__metadata.version must be an integer',
        ),
      );
    }
    if (
      metadata.cacheKey !== undefined &&
      typeof metadata.cacheKey !== 'string'
    ) {
      violations.push(
        typeViolation(
          '__metadata.cacheKey',
          '__metadata.cacheKey must be a string',
        ),
      );
    }
  }

  for (const [descriptors, entry] of Object.entries(lockfile)) {
    if (descriptors === '__metadata') {
      continue;
    }
    const path = JSON.stringify(descriptors);
    if (!isMapping(entry)) {
      violations.push(typeViolation(path, `${path} must be a mapping`));
      continue;
    }
    for (const [field, { type, required }] of Object.entries(ENTRY_FIELDS)) {
      const value = entry[field];
      if (value === undefined) {
        if (required) {
          violations.push(
            typeViolation(
              `${path}.${field}`,
              `${path} is missing the required "${field}" field`,
            ),
          );
        }
        continue;
      }
      violations.push(...validateType(`${path}.${field}`, value, type));
    }
    if (
      typeof entry.linkType === 'string' &&
      entry.linkType !== 'hard' &&
      entry.linkType !== 'soft'
    ) {
      violations.push(
        typeViolation(
          `${path}.linkType`,
          `${path}.linkType must be "hard" or "soft", got ${JSON.stringify(entry.linkType)}`,
        ),
      );
    }
    if (
      typeof entry.checksum === 'string' &&
      !/^([0-9a-z]+\/)?[0-9a-f]+$/.test(entry.checksum)
    ) {
      violations.push(
        typeViolation(
          `${path}.checksum`,
          `${path}.checksum has an unexpected format: ${JSON.stringify(entry.checksum)}`,
        ),
      );
    }
  }
  return violations;
};

/**
 * Finds localhost references anywhere in the lockfile: entry keys (descriptors),
 * `resolution` (e.g. `foo@npm:1.0.0::__archiveUrl=http%3A%2F%2Flocalhost%3A4873%2F...`),
 * dependency ranges (e.g. `http://localhost:4873/foo/-/foo-1.0.0.tgz`) and any other value.
 */
export const findLockfileLoopbackReferences = (
  lockfile: Record<string, LockfileNode>,
): LockfileViolation[] => {
  const violations: LockfileViolation[] = [];
  const walk = (node: LockfileNode, path: string) => {
    if (typeof node === 'string') {
      for (const reference of findLoopbackReferences(node)) {
        violations.push({
          kind: 'localhost',
          path,
          message: `${path} value ${JSON.stringify(node)} points to localhost (${reference})`,
        });
      }
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      const childPath = path === '' ? JSON.stringify(key) : `${path}.${key}`;
      for (const reference of findLoopbackReferences(key)) {
        violations.push({
          kind: 'localhost',
          path: childPath,
          message: `key ${childPath} points to localhost (${reference})`,
        });
      }
      walk(value, childPath);
    }
  };
  walk(lockfile, '');
  return violations;
};

/**
 * Finds localhost references in a .yarnrc.yml file, e.g. `npmRegistryServer: "http://localhost:4873"`
 * or `unsafeHttpWhitelist: [localhost]` left behind while Verdaccio was in use.
 */
export const findYarnrcLoopbackReferences = (
  content: string,
  fileName = '.yarnrc.yml',
): LockfileViolation[] =>
  content.split(/\r?\n/).flatMap((line, index) => {
    const withoutComment = line.replace(/(^|\s)#.*$/, '').trim();
    if (withoutComment === '') {
      return [];
    }
    // the value part of `key: value`, `- value` and `[a, b]` lines
    const values = withoutComment
      .replace(/^-\s+/, '')
      .replace(/^("[^"]*"|[^\s:"]+):(\s+|$)/, '')
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((value) => value.trim().replace(/^["']|["']$/g, ''))
      .filter((value) => value !== '');
    const references = new Set([
      ...findLoopbackReferences(withoutComment),
      ...values.flatMap(findLoopbackReferences),
    ]);
    return [...references].map(
      (reference): LockfileViolation => ({
        kind: 'localhost',
        path: `${fileName}:${index + 1}`,
        message: `${fileName} line ${index + 1} points to localhost (${reference}): ${withoutComment}`,
      }),
    );
  });

/**
 * Validates a Yarn berry lockfile (and the project's .yarnrc.yml):
 * - the lockfile parses and every entry has the expected value types;
 * - nothing references a localhost/loopback registry (Verdaccio leakage).
 */
export class LockFileValidator {
  /**
   * Creates lockfile validator.
   * @param lockfilePath path to yarn.lock
   * @param yarnrcPath path to .yarnrc.yml; skipped when the file does not exist
   */
  constructor(
    private readonly lockfilePath: string = 'yarn.lock',
    private readonly yarnrcPath: string = '.yarnrc.yml',
  ) {}

  /**
   * Collects all violations without throwing.
   */
  getViolations = async (): Promise<LockfileViolation[]> => {
    const content = await readFile(this.lockfilePath, 'utf-8');
    const violations: LockfileViolation[] = [];
    try {
      const lockfile = parseYarnLockfile(content);
      violations.push(
        ...validateLockfileStructure(lockfile),
        ...findLockfileLoopbackReferences(lockfile),
      );
    } catch (e) {
      violations.push({
        kind: 'parse',
        path: this.lockfilePath,
        message: `${this.lockfilePath} could not be parsed: ${(e as Error).message}`,
      });
    }
    if (existsSync(this.yarnrcPath)) {
      violations.push(
        ...findYarnrcLoopbackReferences(
          await readFile(this.yarnrcPath, 'utf-8'),
          this.yarnrcPath,
        ),
      );
    }
    return violations;
  };

  /**
   * Throws if the lockfile is invalid or anything references localhost.
   */
  validate = async (): Promise<void> => {
    const violations = await this.getViolations();
    if (violations.length === 0) {
      return;
    }
    const hasLocalhost = violations.some((v) => v.kind === 'localhost');
    throw new Error(
      [
        `Lockfile validation failed with ${violations.length} violation(s):`,
        ...violations.map((violation) => `  - ${violation.message}`),
        ...(hasLocalhost ? ['', RECOVERY_INSTRUCTIONS] : []),
      ].join(EOL),
    );
  };
}
