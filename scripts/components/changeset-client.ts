import { readdir, rm, writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const CHANGESET_DIR_NAME = '.changeset';
const PATCH = 'patch';

export type ParsedChangeset = {
  packages: string[];
  summary: string;
};

/**
 * Changeset client for creating and deleting changesets programmatically
 * Can be extended if we want to support other version bump types in the future
 */
export class ChangesetClient {
  private readonly changesetDir: string;

  constructor(private readonly projectRoot?: string) {
    this.projectRoot = projectRoot || process.cwd();
    this.changesetDir = join(this.projectRoot, CHANGESET_DIR_NAME);
  }

  /**
   * Generates new changeset from provided array of packages and summary
   *
   * Currently it applies a patch bump to each package. If we find ourselves needing fine-grained control
   * over package version bumps, this class can be extended to accommodate that
   *
   */
  patch = async (packages: string[], summary: string) => {
    const contents = this.generateChangesetContents(packages, summary, PATCH);

    await this.saveChangeset(contents);
  };

  /**
   * Parses changeset file contents
   * @param body - contents of changeset markdown file
   * @returns object containing array of changed packages & summary
   */
  parse = (body: string): ParsedChangeset => {
    const [header, ...summaryLines] = body
      .split('---')
      .map((part) => part.trim())
      .filter(Boolean);

    const packages = header
      ? header
          .split('\n')
          .map((line) => line.split(':')[0].trim().replace(/['"]/g, ''))
      : [];

    const summary = summaryLines.join(' ').trim();

    return {
      packages,
      summary,
    };
  };

  /**
   * Deletes all changeset markdown files in the .changeset dir
   *
   * @returns array of parsed changeset contents from the deleted files
   */
  deleteAll = async () => {
    const files = await readdir(this.changesetDir);
    const deletedChangesets: ParsedChangeset[] = [];

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = join(this.changesetDir, file);
        const parsed = this.parse(await readFile(filePath, 'utf-8'));
        deletedChangesets.push(parsed);

        await rm(filePath);
      }
    }

    return deletedChangesets;
  };

  private generateChangesetContents = (
    packages: string[],
    summary: string,
    bumpType = PATCH,
  ) => {
    const packageHeader = packages
      .map((packageName) => `'${packageName}': ${bumpType}\n`)
      .join('');

    const contents = `---\n${packageHeader}---\n\n${summary}\n`;

    return contents;
  };

  /**
   * Creates a new changeset markdown file from provided input
   */
  private saveChangeset = async (contents: string) => {
    const changesetFileName = `changeset-${Date.now()}.md`;

    const changesetFilePath = join(this.changesetDir, changesetFileName);

    await writeFile(changesetFilePath, contents);
  };
}
