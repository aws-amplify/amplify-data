import { createHash } from 'crypto';
// eslint-disable-next-line import/no-extraneous-dependencies
import jsdom from 'jsdom';
import * as prettier from 'prettier';

type PageCodeBlocks = Record<string, NamedCodeBlocks>;
type NamedCodeBlocks = Record<string, { code: string; hash: string }>;

async function getHTMLDocument(url: string) {
  const data = await fetch(url).then((result) => result.text());
  const dom = new jsdom.JSDOM(data);
  return dom.window.document;
}

function generateHash(data: string): string {
  return createHash('sha256').update(data, 'utf-8').digest('hex');
}

function codeblockFilename(element: HTMLElement) {
  const ariaAttr = element.getAttribute('aria-label');
  const [filename, ..._description] = ariaAttr?.split(' ') || [];
  return filename;
}

function isTS(snippetName: string) {
  const [_, ext] = snippetName.split('.');
  return ['ts', 'tsx'].includes(ext);
}

/**
 * Converts HTML to text, preserving semantic newlines for block-level
 * elements.
 */
function innerTextPreservingNewlines(node: Node) {
  let result = '';

  if (node.nodeType == node.TEXT_NODE && node.nodeValue) {
    // Replace repeated spaces, newlines, and tabs with a single space.
    // result = node.nodeValue.replace(/\s+/g, " ");
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

  return result;
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

async function getPageCodeBlocks(doc: Document): Promise<NamedCodeBlocks> {
  const results: NamedCodeBlocks = {};

  for (const pre of doc.getElementsByTagName('pre')) {
    const snippetName = codeblockFilename(pre);
    if (!isTS(snippetName)) continue;
    const code = await format(pre);
    const hash = generateHash(code);
    results[snippetName] = { code, hash };
  }

  return results;
}

async function getAll(urls: string[]): Promise<PageCodeBlocks> {
  const results: PageCodeBlocks = {};

  for (const url of urls) {
    console.log(`processing ${url}`);
    const dom = await getHTMLDocument(url);
    results[url] = await getPageCodeBlocks(dom);
  }

  return results;
}

async function findPages() {
  const sitemapURL = 'https://docs.amplify.aws/sitemap.xml';
  const locTags = (await getHTMLDocument(sitemapURL)).getElementsByTagName(
    'loc',
  );
  return [...locTags]
    .map((t) => t.innerHTML)
    .filter((h) => h.includes('react/build-a-backend/data/'));
}

const urls = await findPages();
const results = await getAll(urls);
console.log(JSON.stringify(results, null, 2));
