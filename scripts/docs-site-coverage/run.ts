import { buildSnippets } from './fetch-snippets';
import { buildRegionMap } from './find-integs';
import { CoverageReporter } from './reporting';
import { config } from './config';

const report = await new CoverageReporter({
  config,
  buildSnippets,
  buildRegionMap,
}).report();
report.write(config.openReportWhenDone);

// TODO: process needs to exit non-zero with report shows lack of coverage or orphaned integs
// (Could alternatively report or return a coverage percentage and set a threshold...)
