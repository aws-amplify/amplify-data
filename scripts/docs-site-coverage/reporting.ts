import { writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { relative, dirname } from 'path';
import { URL } from 'url';
import { rimrafSync } from 'rimraf';
import type { CodeSnippet, CodeSnippetMap } from './fetch-snippets';
import { Region, RegionMap } from './find-integs';
import type { Config } from './config-type';

export class SnippetStatus {
  constructor(
    public snippet: CodeSnippet,
    public coverages: Region[],
  ) {}

  get isCovered() {
    return this.coverages.length > 0;
  }
}

export type DiscoveredSnippets = {
  /**
   * Discovered code snippets grouped by their docs site page path.
   */
  byUrl: CodeSnippetMap;

  /**
   * Discovered code snippets grouped by the hash of the snippet code.
   */
  byHash: CodeSnippetMap;
};

export type SnippetIndex = Record<string, SnippetStatus[]>;
export type SnippetIndexes = Record<keyof DiscoveredSnippets, SnippetIndex>;

export class CoverageStatus {
  constructor(
    public region: Region & { hash: string },
    public snippets: SnippetStatus[],
  ) {}

  get isOrphaned() {
    return this.snippets.length === 0;
  }
}

type CoverageReportInit = {
  config: Config;
  buildSnippets: (config: Config) => Promise<CodeSnippet[]>;
  buildRegionMap: (config: Config) => Promise<RegionMap>;
};

type PageCoverageSummary = {
  coverage: number;
  coverageString: string;
  covered: number;
  total: number;
  url: string;
  reportPath: string;
};

export class CoverageReporter {
  constructor(private inits: CoverageReportInit) {}

  async report() {
    const snippets = await this.inits.buildSnippets(this.inits.config);
    const coverage = await this.inits.buildRegionMap(this.inits.config);
    return new CoverageReport(
      snippets,
      coverage,
      this.inits.config.outputDirectory,
    );
  }
}

function groupBy<T>(
  items: T[],
  groupOf: (item: T) => string,
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const group = groupOf(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  }
  return groups;
}

function sum<T>(items: T[], select: (item: T) => number) {
  let runningTotal = 0;
  for (const item of items) {
    runningTotal += select(item);
  }
  return runningTotal;
}

export class CoverageReport {
  private snippetIndex: SnippetIndexes;

  constructor(
    public snippets: CodeSnippet[],
    public coverage: RegionMap,
    public reportPath: string,
  ) {
    const all: SnippetStatus[] = [];
    for (const snippet of this.snippets) {
      all.push(new SnippetStatus(snippet, this.coverage[snippet.hash] || []));
    }
    const byHash = groupBy(all, (s) => s.snippet.hash);
    const byUrl = groupBy(all, (s) => s.snippet.url);
    this.snippetIndex = { byHash, byUrl };
  }

  get allCoverageStatuses(): CoverageStatus[] {
    const all: CoverageStatus[] = [];
    for (const [hash, linkedRegions] of Object.entries(this.coverage)) {
      for (const region of linkedRegions) {
        all.push(
          new CoverageStatus(
            { ...region, hash },
            this.snippetIndex.byHash[hash] || [],
          ),
        );
      }
    }
    return all;
  }

  /**
   * Test coverage regions that claim to be covering a snippet, but for which
   * the snippet identifier (hash) doesn't actually exist in the snippets.
   */
  get orphanedRegions(): (Region & { hash: string })[] {
    return this.allCoverageStatuses
      .filter((c) => c.isOrphaned)
      .map((c) => c.region);
  }

  relativePath(path: string) {
    return relative(this.reportPath, path);
  }

  /**
   * Formats an individual snippet into markdown for the report.
   *
   * @param snippet The individual snippet to format.
   * @param reportPath The file path that this report MD is written to; used for generated relative links.
   */
  formatSnippetStatus(
    { snippet: { code, hash, name }, isCovered }: SnippetStatus,
    reportPath: string,
  ): string {
    const refs = this.formatRegionReferences(hash, reportPath).trim();
    const status = isCovered ? '✅' : '❌';

    return `#### \`${name || 'Unnamed Snippet'}\`

    ~~~\n${code}\n~~~

    | | |
    | -- | -- |
    | Hash | \`${hash}\` |
    | Covered | ${status} |

    ##### Covering Regions

    ${refs || '- *None*'}

    ---
    `.replace(/^ {4}/gm, ''); // dedent 4
  }

  /**
   * Formats an individual test code region into markdown for reporting.
   *
   * @param region The region to format
   */
  formatTestRegion(region: Region & { hash: string }): string {
    const link = `${this.relativePath(region.path)}#${region.start}`;
    return `#### [${region.hash}](${link})

    ##### [\`${link}\`](${link})

    ~~~\n${region.code}\n~~~

    ---
    `.replace(/^ {4}/gm, ''); // dedent 4
  }

  /**
   *
   * @param hash Region hash to find and format references to.
   * @param reportPath The file path that this report MD is written to; used for generated relative links.
   * @returns
   */
  formatRegionReferences(hash: string, reportPath: string): string {
    const regions = this.coverage[hash] || [];
    return regions
      .map((r) => {
        // not sure why offhand, but this backlink path contains an extra '../'
        const relativePath = relative(reportPath, r.path).substring(3);

        // use the path relative to reporting root for brevity.
        // we also escape `_` chars to avoid them rendering like bold in `__test__` path.
        const visiblePath = this.relativePath(r.path).replace(/_/g, '\\_');

        const link = `${relativePath}#${r.start}`;
        return `- [${visiblePath}](${link})`;
      })
      .join('\n');
  }

  formatPageCoverageSummaryRow(summary: PageCoverageSummary): string {
    return (
      '| ' +
      [
        new URL(summary.url).pathname,
        `[docs](${summary.url}) / [report](${this.relativePath(summary.reportPath)})`,
        summary.covered,
        summary.total,
        summary.coverageString,
      ].join(' | ') +
      ' |'
    );
  }

  /**
   *
   * @param coverage Count or percentage percentage of covered items.
   * @param totalItems Total count of items. If `coverage` is already a percentage, omit or set to 1.
   * @returns
   */
  formatCoverage(coverage: number, totalItems: number = 1): string {
    return (100 * (coverage / totalItems)).toFixed(1) + '%';
  }

  writeDocsCoverages() {
    const indexPath = `${this.reportPath}/docs-pages.md`;

    const writtenSnippetReports = Object.entries(this.snippetIndex.byUrl).map(
      ([url, snippetStatuses]) =>
        this.writeDocsCoverageForPage(url, snippetStatuses),
    );

    const summaryLines = writtenSnippetReports
      .map((s) => this.formatPageCoverageSummaryRow(s))
      .join('\n');

    const totalCovered = sum(writtenSnippetReports, (r) => r.covered);
    const totalSnippets = sum(writtenSnippetReports, (r) => r.total);
    const coverageString = this.formatCoverage(totalCovered, totalSnippets);

    const totalLine = `| TOTAL | | ${totalCovered} | ${totalSnippets} | ${coverageString} |`;

    mkdirSync(dirname(indexPath), { recursive: true });
    writeFileSync(
      indexPath,
      `[<- Back to summary](./readme.md)
      
      # In-Scope Pages

      | Docs Site Path | Links | Covered | Total | % |
      | -- | -- | -- | -- | -- |
      ${summaryLines}
      ${totalLine}

      [<- Back to summary](./readme.md)
      `.replace(/^ {6}/gm, ''), // dedent 6
    );

    return { coverageString, path: indexPath };
  }

  writeDocsCoverageForPage(
    url: string,
    snippets: SnippetStatus[],
  ): PageCoverageSummary {
    const basePath = new URL(url).pathname.substring(1);
    const urlPath =
      basePath.length === 0 || basePath.endsWith('/')
        ? basePath + 'index'
        : basePath;
    const reportPath = `${this.reportPath}/docs-page/${urlPath}.md`;

    // not sure why offhand, but this backlink path contains an extra '../'
    const backLink = relative(
      reportPath,
      `${this.reportPath}/docs-pages.md`,
    ).substring(3);

    const covered = snippets.filter((s) => s.isCovered).length;
    const total = snippets.length;
    const coverage = covered / total;
    const coverageString = this.formatCoverage(covered, total);

    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(
      reportPath,
      `[<- Back to index](${backLink})

      #  Snippets

      Page: ${url}

      Coverage: ${coverageString}

      ${snippets
        .map((s) => this.formatSnippetStatus(s, reportPath))
        .join('\n')
        .trim()}

      [<- Back to index](${backLink})
      `.replace(/^ {6}/gm, ''), // dedent 6
    );

    return {
      coverage,
      coverageString,
      covered,
      total,
      url,
      reportPath,
    };
  }

  /**
   * @param open Open the summary file using `code <filename>` when done.
   */
  write(open: boolean) {
    const SUMMARY_PATH = `${this.reportPath}/readme.md`;
    const ORPHANS_REPORT_PATH = `${this.reportPath}/orphans-report.md`;

    rimrafSync(this.reportPath);

    const docsSummary = this.writeDocsCoverages();

    mkdirSync(dirname(SUMMARY_PATH), { recursive: true });
    writeFileSync(
      SUMMARY_PATH,
      `# Docs Coverage Report

      | Report | Count/Coverage |
      | -- | -- |
      | [Docs Snippet Coverage](${this.relativePath(docsSummary.path)}) | ${docsSummary.coverageString} |
      | [Orphaned Integ Tets](${this.relativePath(ORPHANS_REPORT_PATH)}) | ${this.orphanedRegions.length} |
      `.replace(/^ {6}/gm, ''), // dedent 6
    );

    mkdirSync(dirname(ORPHANS_REPORT_PATH), { recursive: true });
    writeFileSync(
      ORPHANS_REPORT_PATH,
      `[<- Back to summary](${this.relativePath(SUMMARY_PATH)})

      # Orphaned Integ Tests

      ${this.orphanedRegions
        .map((r) => this.formatTestRegion(r))
        .join('\n')
        .trim()}

      [<- Back to summary](${this.relativePath(SUMMARY_PATH)})
      `.replace(/^ {6}/gm, ''), // dedent 6
    );

    if (open) execSync(`code ${SUMMARY_PATH}`);
  }
}
