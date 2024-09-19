import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { relative } from 'path';
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

export class CoverageStatus {
  constructor(
    public region: Region & { hash: string },
    public snippets: CodeSnippet[],
  ) {}

  get isOrphaned() {
    return this.snippets.length === 0;
  }
}

type CoverageReportInit = {
  config: Config;
  buildSnippetMap: (config: Config) => Promise<CodeSnippetMap>;
  buildRegionMap: (config: Config) => Promise<RegionMap>;
};

export class CoverageReporter {
  constructor(private inits: CoverageReportInit) {}

  async report() {
    const snippets = await this.inits.buildSnippetMap(this.inits.config);
    const coverage = await this.inits.buildRegionMap(this.inits.config);
    return new CoverageReport(
      snippets,
      coverage,
      this.inits.config.outputDirectory,
    );
  }
}

export class CoverageReport {
  constructor(
    public snippets: CodeSnippetMap,
    public coverage: RegionMap,
    public reportPath: string,
  ) {}

  get allSnippetStatuses(): SnippetStatus[] {
    const all: SnippetStatus[] = [];
    for (const [hash, snippets] of Object.entries(this.snippets)) {
      for (const snippet of snippets) {
        all.push(new SnippetStatus(snippet, this.coverage[hash] || []));
      }
    }
    return all;
  }

  get allCoverageStatuses(): CoverageStatus[] {
    const all: CoverageStatus[] = [];
    for (const [hash, linkedRegions] of Object.entries(this.coverage)) {
      for (const region of linkedRegions) {
        all.push(
          new CoverageStatus({ ...region, hash }, this.snippets[hash] || []),
        );
      }
    }
    return all;
  }

  get coveredSnippets(): CodeSnippet[] {
    return this.allSnippetStatuses
      .filter((s) => s.isCovered)
      .map((s) => s.snippet);
  }

  get uncoveredSnippets(): CodeSnippet[] {
    return this.allSnippetStatuses
      .filter((s) => !s.isCovered)
      .map((s) => s.snippet);
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
  formatSnippet({ path, code, hash, name }: CodeSnippet): string {
    const refs = this.formatRegionReferences(hash).trim();
    const status = refs.length === 0 ? '❌' : '✅';

    return `#### [${path}](${path})

    ##### \`${name || 'Unnamed Snippet'}\`

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

  /**
   * @param open Open the summary file using `code <filename>` when done.
   */
  write(open: boolean) {
    const SUMMARY_PATH = `${this.reportPath}/summary.md`;
    const GAPS_REPORT_PATH = `${this.reportPath}/gaps-report.md`;
    const ORPHANS_REPORT_PATH = `${this.reportPath}/orphans-report.md`;
    const DETAILS_REPORT_PATH = `${this.reportPath}/coverage-details.md`;

    writeFileSync(
      SUMMARY_PATH,
      `# Docs Coverage Report

      | Report | Records |
      | -- | -- |
      | [Docs Snippet Gaps](${this.relativePath(GAPS_REPORT_PATH)}) | ${this.uncoveredSnippets.length} |
      | [Orphaned Integ Tets](${this.relativePath(ORPHANS_REPORT_PATH)}) | ${this.orphanedRegions.length} |
      | [Coverage Details](${this.relativePath(DETAILS_REPORT_PATH)}) | ${this.coveredSnippets.length} |
      `.replace(/^ {6}/gm, ''),
    ); // dedent 6

    writeFileSync(
      GAPS_REPORT_PATH,
      `[<- Back to summary](${this.relativePath(SUMMARY_PATH)})

      # Uncovered Docs Snippets

      ${this.uncoveredSnippets
        .map((s) => this.formatSnippet(s))
        .join('\n')
        .trim()}

      [<- Back to summary](${this.relativePath(SUMMARY_PATH)})
      `.replace(/^ {6}/gm, ''),
    ); // dedent 6

    writeFileSync(
      ORPHANS_REPORT_PATH,
      `[<- Back to summary](${this.relativePath(SUMMARY_PATH)})

      # Orphaned Integ Tests

      ${this.orphanedRegions
        .map((r) => this.formatTestRegion(r))
        .join('\n')
        .trim()}

      [<- Back to summary](${this.relativePath(SUMMARY_PATH)})
      `.replace(/^ {6}/gm, ''),
    ); // dedent 6

    writeFileSync(
      DETAILS_REPORT_PATH,
      `[<- Back to summary](${this.relativePath(SUMMARY_PATH)})

      # Covered Docs Snippets

      ${this.coveredSnippets
        .map((s) => this.formatSnippet(s))
        .join('\n')
        .trim()}

      [<- Back to summary](${this.relativePath(SUMMARY_PATH)})
      `.replace(/^ {6}/gm, ''), // dedent 4
    );

    if (open) execSync(`code ${SUMMARY_PATH}`);
  }
}
