// import { writeFileSync } from 'fs';
import { fetchSnippets } from './fetch-snippets';

// const OUTPUT_DIR = `${__dirname}/../../../coverages/docs-site`;
// const RAW_DOCS_SITE_REPORT_PATH = `${OUTPUT_DIR}/docs-site-data.json`;

const snippets = await fetchSnippets();
console.log(JSON.stringify(snippets, null, 2));

// writeFileSync(RAW_DOCS_SITE_REPORT_PATH, JSON.stringify(snippets, null, 2));
