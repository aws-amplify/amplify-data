import { writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { relative, dirname } from 'path';
import { URL } from 'url';
import { rimrafSync } from 'rimraf';
import type { CodeSnippet, DiscoveredSnippets } from './fetch-snippets';
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
    const byPath = groupBy(all, (s) => s.snippet.path);
    this.snippetIndex = { byHash, byPath };
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
   */
  formatSnippetStatus({
    snippet: { code, hash, name },
    isCovered,
  }: SnippetStatus): string {
    const refs = this.formatRegionReferences(hash).trim();
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

  formatRegionReferences(hash: string): string {
    const regions = this.coverage[hash] || [];
    return regions
      .map((r) => {
        const link = `${this.relativePath(r.path)}#${r.start}`;
        return `- [${link}](${link})`;
      })
      .join('\n');
  }

  writeDocsCoverages() {
    const indexPath = `${this.reportPath}/docs-pages.md`;

    const writtenSnippetReports = Object.entries(this.snippetIndex.byPath).map(
      ([path, s]) => this.writeDocsCoverageForPath(path, s),
    );

    const summaryLines = writtenSnippetReports
      .map(
        (r) =>
          '| ' +
          [
            r.url,
            `[${this.relativePath(r.reportPath)}](${this.relativePath(r.reportPath)})`,
            r.covered,
            r.uncovered,
            r.coverageString,
          ].join(' | ') +
          ' |',
      )
      .join('\n');

    const totalCovered = writtenSnippetReports.reduce(
      (sum, r) => sum + r.covered,
      0,
    );

    const totalUncovered = writtenSnippetReports.reduce(
      (sum, r) => sum + r.uncovered,
      0,
    );

    const coverageString =
      ((100 * totalCovered) / (totalCovered + totalUncovered)).toFixed(1) + '%';

    const totalLine = `| TOTAL | | ${totalCovered} | ${totalUncovered} | ${coverageString} |`;

    mkdirSync(dirname(indexPath), { recursive: true });
    writeFileSync(
      indexPath,
      `[<- Back to summary](../)
      
      # In-Scope Pages

      | URL | Report | Covered | Uncovered | % |
      | -- | -- | -- | -- | -- |
      ${summaryLines}
      ${totalLine}

      [<- Back to summary](../)
      `.replace(/^ {6}/gm, ''), // dedent 6
    );

    return { coverageString, path: indexPath };
  }

  writeDocsCoverageForPath(url: string, snippets: SnippetStatus[]) {
    const basePath = new URL(url).pathname.substring(1);
    const urlPath = basePath.endsWith('/') ? basePath + 'index' : basePath;
    const reportPath = `${this.reportPath}/docs-page/${urlPath}.md`;

    // not sure why offhand, but this backlink path contains an extra '../'
    const backLink = relative(
      reportPath,
      `${this.reportPath}/docs-pages.md`,
    ).substring(3);

    const covered = snippets.filter((s) => s.isCovered).length;
    const uncovered = snippets.filter((s) => !s.isCovered).length;
    const coverage = covered / (covered + uncovered);
    const coverageString = (100 * coverage).toFixed(1) + '%';

    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(
      reportPath,
      `[<- Back to index](${backLink})

      #  Snippets

      Page: ${url}

      Coverage: ${coverageString}

      ${snippets
        .map((s) => this.formatSnippetStatus(s))
        .join('\n')
        .trim()}

      [<- Back to index](${backLink})
      `.replace(/^ {6}/gm, ''), // dedent 6
    );

    return {
      coverage,
      coverageString,
      covered,
      uncovered,
      url,
      reportPath,
    };
  }

  /**
   * @param open Open the summary file using `code <filename>` when done.
   */
  write(open: boolean) {
    const SUMMARY_PATH = `${this.reportPath}/summary.md`;
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
