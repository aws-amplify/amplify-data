import { createHash } from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import jsdom from 'jsdom';
import * as prettier from 'prettier';
import type { Config } from './config-type';

export type CodeSnippet = {
  path: string;
  name: string;
  code: string;
  hash: string;
};

export type CodeSnippetMap = Record<string, CodeSnippet[]>;

export type DiscoveredSnippets = {
  /**
   * Discovered code snippets grouped by their docs site page path.
   */
  byPath: CodeSnippetMap;

  /**
   * Discovered code snippets grouped by the hash of the snippet code.
   */
  byHash: CodeSnippetMap;
};

async function getHTMLDocument(url: string) {
  const data = await fetch(url).then((result) => result.text());
  const dom = new jsdom.JSDOM(data);
  return dom.window.document;
}

/**
 * Produces a short (truncated) hash string with a *pretty low* chance of collision.
 *
 * Intended to identify code snippets and detect changes. **Not intended for any
 * cryptographic or security purposes.**
 *
 * @param data The string to hash.
 * @returns A 16 character hexadecimal string.
 */
function generateHash(data: string): string {
  return createHash('sha256')
    .update(data, 'utf-8')
    .digest('hex')
    .substring(0, 16); // 64 bits of collision resistance
}

function codeblockFilename(element: HTMLElement) {
  const ariaAttr = element.getAttribute('aria-label');
  const [filename, ..._description] = ariaAttr?.split(' ') || [];
  return filename;
}

/**
 * Converts HTML to text, preserving semantic newlines for block-level
 * elements.
 */
function innerTextPreservingNewlines(node: Node) {
  let result = '';

  if (node.nodeType == node.TEXT_NODE && node.nodeValue) {
    result = node.nodeValue;
  } else {
    for (let i = 0, j = node.childNodes.length; i < j; i++) {
      result += innerTextPreservingNewlines(node.childNodes[i]);
    }

    // `tagName` is present in nodes that are also `HTMLElement`s.
    if ('tagName' in node && node.tagName === 'DIV' && !result.endsWith('\n')) {
      result += '\n';
    }
  }

  return result.replaceAll('Copy highlighted code example', '');
}

/**
 * @param tag
 * @param verbose - Whether to log `prettier` errors. Default `false`.
 */
async function format(tag: HTMLPreElement, verbose = false) {
  let code = innerTextPreservingNewlines(tag);
  try {
    code = await prettier.format(code, { parser: 'typescript' });
  } catch (err) {
    if (verbose) {
      console.log('\n');
      console.error(err);
      console.log('\n\n');
    }
  }
  return code;
}

async function getPageCodeBlocks(
  path: string,
  doc: Document,
): Promise<CodeSnippet[]> {
  const results: CodeSnippet[] = [];

  for (const pre of doc.getElementsByTagName('pre')) {
    const name = codeblockFilename(pre);
    const code = await format(pre);
    const hash = generateHash(code);
    results.push({ path, name, code, hash });
  }

  return results;
}

async function fetchDocuments(
  urls: string[],
): Promise<Record<string, Document>> {
  const results: Record<string, Document> = {};
  for (const url of urls) {
    console.log(`processing ${url}`);
    results[url] = await getHTMLDocument(url);
  }
  return results;
}

async function extractCodeBlocks(
  docs: Record<string, Document>,
): Promise<CodeSnippet[]> {
  const results: CodeSnippet[] = [];
  for (const [url, dom] of Object.entries(docs)) {
    results.push(...(await getPageCodeBlocks(url, dom)));
  }
  return results;
}

async function discoverPages({ sitemapUrl, sitemapFilter }: Config) {
  const locTags = (await getHTMLDocument(sitemapUrl)).getElementsByTagName(
    'loc',
  );
  return [...locTags].map((t) => t.innerHTML).filter(sitemapFilter);
}

async function fetchSnippets(urls: string[]) {
  const docs = await fetchDocuments(urls);
  return extractCodeBlocks(docs);
}

export async function buildSnippets(config: Config): Promise<CodeSnippet[]> {
  const urls = await discoverPages(config);
  return await fetchSnippets(urls);
}
