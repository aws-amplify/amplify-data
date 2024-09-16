import type { CodeSnippet, CodeSnippetMap } from './fetch-snippets';
import type { Region, RegionMap } from './find-integs';

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
    public region: Region,
    public snippets: CodeSnippet[],
  ) {}

  get isOrphaned() {
    return this.snippets.length === 0;
  }
}

export class CoverageReport {
  constructor(
    public snippets: CodeSnippetMap,
    public coverage: RegionMap,
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
        all.push(new CoverageStatus(region, this.snippets[hash] || []));
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
  get orphanedRegions(): Region[] {
    return this.allCoverageStatuses
      .filter((c) => c.isOrphaned)
      .map((c) => c.region);
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

    | | |
    | -- | -- |
    | Hash | \`${hash}\` |
    | Covered | ${status} |

    ##### Covering Regions

    ${refs || '- *None*'}

    ##### \`${name || 'Unnamed Snippet'}\`

    ~~~
    ${code}
    ~~~

    ---
    `.replace(/^ {4}/gm, ''); // dedent 4
  }

  /**
   * Formats an individual test code region into markdown for reporting.
   *
   * @param region The region to format
   */
  formatTestRegion(_region: Region): string {
    return 'Regin Not yet implemented';
  }

  formatRegionReferences(hash: string): string {
    const regions = this.coverage[hash] || [];
    return regions
      .map((r) => {
        const link = `${r.path}:${r.start}:${r.end}`;
        return `- [${link}](${link})`;
      })
      .join('\n');
  }

  toMarkdown() {
    return `# Docs Coverage Report

    ## Uncovered Docs Snippets

    ${this.uncoveredSnippets
      .map((s) => this.formatSnippet(s))
      .join('\n')
      .trim()}

    ## Orphaned Integ Tests

    ${this.orphanedRegions
      .map((r) => this.formatTestRegion(r))
      .join('\n')
      .trim()}

    ---

    ## Covered Docs Snippets

    ${this.coveredSnippets
      .map((s) => this.formatSnippet(s))
      .join('\n')
      .trim()}
    `.replace(/^ {4}/gm, ''); // dedent 4
  }
}
