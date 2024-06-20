import { ChangesetClient } from '../components/changeset-client';
import { readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { newChangesetContentsFromDeleted } from '../components/commit-reverter';

// tests run against actual changeset files in ./fixtures/.changeset
// we're only mocking the destructive/mutating operations
jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  rm: jest.fn(),
  writeFile: jest.fn(),
}));

const MULTI_PACKAGE_FILE_PATH = './.changeset/multi-package.md';

describe('Changeset Client', () => {
  const changesetRoot = join(__dirname, 'fixtures');
  let changesetClient: ChangesetClient;

  beforeEach(() => {
    changesetClient = new ChangesetClient(changesetRoot);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parse', () => {
    it('extracts packages and summary from file contents', async () => {
      expect.assertions(1);

      const filePath = join(changesetRoot, MULTI_PACKAGE_FILE_PATH);

      const fileContents = await readFile(filePath, 'utf-8');
      const result = changesetClient.parse(fileContents);

      const expected = {
        packages: [
          '@aws-amplify/data-schema-types',
          '@aws-amplify/data-schema',
        ],
        summary: 'add JS resolver support for handler.custom',
      };

      expect(result).toEqual(expected);
    });
  });

  describe('deleteAll', () => {
    it('deletes all changeset markdown files and returns their parsed contents', async () => {
      expect.assertions(2);

      const expectedParsedChangesets = [
        {
          packages: [],
          summary: '',
        },
        {
          packages: [
            '@aws-amplify/data-schema-types',
            '@aws-amplify/data-schema',
          ],
          summary: 'add JS resolver support for handler.custom',
        },
        {
          packages: ['@aws-amplify/data-schema'],
          summary:
            'fixed infinite recursion on combo of renameModels() and setRelationships()',
        },
      ];

      const result = await changesetClient.deleteAll();

      expect(rm).toHaveBeenCalledTimes(3);
      expect(result).toEqual(expectedParsedChangesets);
    });
  });

  describe('patch', () => {
    it('creates a new patch changeset with expected contents', async () => {
      expect.assertions(3);

      const packages = [
        '@aws-amplify/data-schema-types',
        '@aws-amplify/data-schema',
      ];

      const summary = `Revert to feat: last good commit
Reverted changes:
* add JS resolver support for handler.custom
* fixed infinite recursion on combo of renameModels() and setRelationships()
`;

      const expectedFileContents = `---
'@aws-amplify/data-schema-types': patch
'@aws-amplify/data-schema': patch
---

Revert to feat: last good commit
Reverted changes:
* add JS resolver support for handler.custom
* fixed infinite recursion on combo of renameModels() and setRelationships()

`;

      await changesetClient.patch(packages, summary);

      expect(writeFile).toHaveBeenCalledTimes(1);
      expect((writeFile as any).mock.calls[0][0]).toEqual(
        expect.stringContaining('__tests__/fixtures/.changeset/changeset-'),
      );
      expect((writeFile as any).mock.calls[0][1]).toEqual(expectedFileContents);
    });
  });
});

// If we end up adding tests for commit-reverter, move this block there
describe('commit-reverter: newChangesetContentsFromDeleted', () => {
  const deletedChangesets = [
    {
      packages: ['@aws-amplify/data-schema-types', '@aws-amplify/data-schema'],
      summary: 'add JS resolver support for handler.custom',
    },
    {
      packages: ['@aws-amplify/data-schema'],
      summary:
        'fixed infinite recursion on combo of renameModels() and setRelationships()',
    },
  ];

  const revertCommitMessage = 'Revert to feat: last good commit';

  it('generates expected new changeset contents for revert patch', () => {
    const expected = {
      packages: ['@aws-amplify/data-schema-types', '@aws-amplify/data-schema'],
      summary: `Revert to feat: last good commit
Reverted changes:
* add JS resolver support for handler.custom
* fixed infinite recursion on combo of renameModels() and setRelationships()
`,
    };

    const result = newChangesetContentsFromDeleted(
      deletedChangesets,
      revertCommitMessage,
    );

    expect(result).toStrictEqual(expected);
  });
});
