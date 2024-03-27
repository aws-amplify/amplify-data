import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { rimraf } from 'rimraf';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import { execSync } from 'child_process';

/**
 * Where api-extractor drops its summary of the API.
 *
 * This is just the default path. Changing this variable alone will not current cause
 * api-extractor to output to a different folder. If we need to change this, refer to
 * `integration-tests/api-extractor.json` to find the config keys that will need to
 * be changed and/or overridden in the config.
 */
const TEMP_EXTRACTION_PATH = path.join(__dirname, '../../../temp');

/**
 * Where the latest/current docs are stored.
 */
const API_DOCS_PATH = path.join(__dirname, '../../../docs');

describe('Publicly exposed API and docstrings', () => {
  test(
    'have not changed',
    async () => {
      /**
       * This builds the API extraction JSON, which is what the documenter will
       * need to consume.
       */
      const apiExtractorJsonPath: string = path.join(
        __dirname,
        '../../../api-extractor.json',
      );
      Extractor.invoke(
        ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath),
        {
          // Equivalent to the "--local" command-line parameter
          localBuild: true,
        },
      );

      /**
       * Clobber and re-generate user-facing API docs.
       *
       * Programmatic access to api-documentor is non-obvious. So, path of least
       * resistence there is to just call via the CLI.
       */
      await rimraf(API_DOCS_PATH);
      execSync(
        `npx api-documenter markdown --input-folder ${TEMP_EXTRACTION_PATH} --output-folder ${API_DOCS_PATH}`,
      );

      /**
       * Confirm there hasn't been a change by comparing a hash of this latest
       * docs generation to the previous one.
       */
      const docFiles = fs.readdirSync(API_DOCS_PATH);
      const computedHash = crypto.createHash('sha256');
      for (const fileName of docFiles) {
        const fileData = fs
          .readFileSync(`${API_DOCS_PATH}/${fileName}`)
          .toString();
        computedHash.update([fileName, fileData].join('\n'));
      }
      expect(computedHash.digest('hex')).toMatchSnapshot();
    },
    30 * 1000,
  );
});
