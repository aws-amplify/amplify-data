import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSnippetMap } from './fetch-snippets';
import { buildRegionMap } from './find-integs';
import { CoverageReport } from './reporting';

// Not defined by default in module scope, I guess ...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = `${__dirname}/../../coverages/docs-site`;
const REPORT_PATH = `${OUTPUT_DIR}/docs-site-report.md`;

const report = new CoverageReport(
  await buildSnippetMap(),
  await buildRegionMap(),
);

writeFileSync(REPORT_PATH, report.toMarkdown());
execSync(`code ${REPORT_PATH}`);

// const misses = [] as (CodeSnippet | Region)[];

// // console.log({ snippets, regions });

// // look for snippets without matching coverage regions
// for (const [hash, matchingSnippets] of Object.entries(snippets)) {
//   if (!regions[hash]) {
//     misses.push(...matchingSnippets);
//     // TODO: Submit snippet + existing test coverage + available testing utils to
//     // LLM to generate suggested test coverage block and/or to suggest adding region
//     // tags to an existing test that sufficiently covers the snippet.
//   } else {
//     // TODO: Submit snippet + test coverage to LLM to assess whether they align?
//   }
// }

// // // look for orphaned coverage regions.
// for (const [hash, linkedRegions] of Object.entries(regions)) {
//   if (!snippets[hash]) {
//     misses.push(...linkedRegions);
//   }
// }

// console.log(JSON.stringify(misses, null, 2));

// writeFileSync(RAW_DOCS_SITE_REPORT_PATH, JSON.stringify(snippets, null, 2));
