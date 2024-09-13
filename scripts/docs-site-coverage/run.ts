// import { writeFileSync } from 'fs';
import { type CodeSnippet, buildSnippetMap } from './fetch-snippets';
import { type Region, buildRegionMap } from './find-integs';

const OUTPUT_DIR = `${__dirname}/../../../coverages/docs-site`;
const RAW_DOCS_SITE_REPORT_PATH = `${OUTPUT_DIR}/docs-site-data.json`;

const misses = [] as (CodeSnippet | Region)[];

const snippets = await buildSnippetMap();
const regions = await buildRegionMap();

// look for snippets without matching coverage regions
// TODO

// look for orphaned coverage regions.
// TODO

console.log(JSON.stringify(misses, null, 2));

// writeFileSync(RAW_DOCS_SITE_REPORT_PATH, JSON.stringify(snippets, null, 2));
