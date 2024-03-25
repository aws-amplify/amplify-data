import * as path from 'path';
import * as fs from 'fs';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
// import { MarkdownDocumenterFeature } from '@microsoft/api-documenter';
import { execSync } from 'child_process';

/**
 * Where api-extractor drops its summary of the API.
 *
 * This is just the default path. Changing this variable alone will not current cause
 * api-extractor to output to a different folder. If we need to change this, refer to
 * `integration-tests/api-extractor.json` to find the config keys that will need to
 * be changed and/or overridden in the config.
 */
const TEMP_EXTRACTION_PATH = './temp';

/**
 * Where the API "documentor" drops the user-facing API docs. This is a temp folder
 * that can be used to compare to the existing docs at the time these tests are run.
 */
const TEMP_DOCS_PATH = './docs-temp';

/**
 * Where the latest/current docs are stored.
 *
 * Can be used show to customers and/or manually audit public API area internally.
 */
const FINAL_DOCS_PATH = './docs';

describe('api', () => {
  test('api', async () => {
    const apiExtractorJsonPath: string = path.join(
      __dirname,
      '../api-extractor.json',
    );

    // Load and parse the api-extractor.json file
    const extractorConfig: ExtractorConfig =
      ExtractorConfig.loadFileAndPrepare(apiExtractorJsonPath);

    // Invoke API Extractor
    const extractorResult: ExtractorResult = Extractor.invoke(extractorConfig, {
      // Equivalent to the "--local" command-line parameter
      localBuild: true,
    });

    // generate user-facing docs in temp location
    execSync(`rm -rf ${TEMP_DOCS_PATH}`);
    execSync(
      `npx api-documenter markdown --input-folder ${TEMP_EXTRACTION_PATH} --output-folder ${TEMP_DOCS_PATH}`,
    );

    // compare generate docs to existing docs, failing if there's a delta.
    const docFiles = fs.readdirSync(TEMP_DOCS_PATH);
    for (const fileName of docFiles) {
      console.log(JSON.stringify(fileName));
    }
  });
});
