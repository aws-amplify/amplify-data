import * as path from 'path';
import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
} from '@microsoft/api-extractor';
// import { MarkdownDocumenterFeature } from '@microsoft/api-documenter';
import { execSync } from 'child_process';

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

      // Equivalent to the "--verbose" command-line parameter
      showVerboseMessages: true,
    });

    execSync(
      'npx api-documenter markdown --input-folder ./temp --output-folder ./docs',
    );

    // const documenter = new MarkdownDocumenterFeature({
    //   _context
    // })
  });
});
