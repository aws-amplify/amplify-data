// import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { type CodeSnippet, buildSnippetMap } from './fetch-snippets';
import { type Region, buildRegionMap } from './find-integs';

// Not defined by default in module scope, I guess ...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = `${__dirname}/../../../coverages/docs-site`;
const RAW_DOCS_SITE_REPORT_PATH = `${OUTPUT_DIR}/docs-site-data.json`;

const misses = [] as (CodeSnippet | Region)[];

// const snippets = await buildSnippetMap();
const regions = await buildRegionMap();
console.log({ regions });

// look for snippets without matching coverage regions
// for (const [hash, matchingSnippets] of Object.entries(snippets)) {
//   if (!regions[hash]) {
//     misses.push(...matchingSnippets);
//   }
// }

// // look for orphaned coverage regions.
// for (const [hash, linkedRegions] of Object.entries(regions)) {
//   if (!snippets[hash]) {
//     misses.push(...linkedRegions);
//   }
// }

console.log(JSON.stringify(misses, null, 2));

// writeFileSync(RAW_DOCS_SITE_REPORT_PATH, JSON.stringify(snippets, null, 2));
