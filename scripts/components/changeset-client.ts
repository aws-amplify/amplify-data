import { writeFile } from 'fs/promises';
import { join } from 'path';

const CHANGESET_DIR = '.changeset';
const PATCH = 'patch';
const LEVEL_PLACEHOLDER = '<<__LEVEL__>>';

const TEMPLATE = `---
"@aws-amplify/data-schema": ${LEVEL_PLACEHOLDER}
---

`;

/**
 * Rudimentary changeset client for creating a revert patch changeset.
 * Can be extended if we want to support other version bump types in the future
 */
export class ChangesetClient {
  constructor(private readonly projectRoot: string = process.cwd()) {}

  patch = async (message: string) => {
    const template =
      TEMPLATE.replace(LEVEL_PLACEHOLDER, PATCH) + message + '\n';

    await this.generateFromTemplate(template);
  };

  private generateFromTemplate = async (template: string) => {
    const changesetFileName = `changeset-${Date.now()}.md`;
    const changesetFilePath = join(
      this.projectRoot,
      CHANGESET_DIR,
      changesetFileName,
    );

    await writeFile(changesetFilePath, template);
  };
}
