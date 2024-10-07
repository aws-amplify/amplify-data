import path from 'path';
import { fileURLToPath } from 'url';
import type { Config } from './config-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testsDirectory = `${__dirname}/../../packages/integration-tests/__tests__/defined-behavior`;
const outputDirectory = `${__dirname}/../../coverages/docs-site`;

const ingoredPaths: (string | RegExp)[] = [
  // Gen1 DX is out of scope entirely
  /^https:\/\/docs.amplify\.aws\/gen1/,

  // Non-TS platforms
  /^https:\/\/docs\.amplify\.aws\/flutter/,
  /^https:\/\/docs\.amplify\.aws\/android/,
  /^https:\/\/docs\.amplify\.aws\/swift/,

  // Focus on React pages ONLY for now.
  // Differentiation between TS platforms snippets does not equal differentiation in data
  // category behavior.
  /^https:\/\/docs\.amplify\.aws\/nextjs/,
  /^https:\/\/docs\.amplify\.aws\/angular/,
  /^https:\/\/docs\.amplify\.aws\/vue/,
  /^https:\/\/docs\.amplify\.aws\/javascript/,
  /^https:\/\/docs\.amplify\.aws\/react-native/,

  // Intro/Getting started content that is specifically non-data
  'https://docs.amplify.aws/react/start/',
  'https://docs.amplify.aws/react-native/start/account-setup/',
  'https://docs.amplify.aws/react/start/connect-to-aws-resources/',
  'https://docs.amplify.aws/react/start/migrate-to-gen2/',

  // Categories: Auth, Storage
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/auth/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/storage/,

  // Functions. There are 2 or 3 incidental schema builder snippets here. AFAIK, these should
  // be covered by backend.
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/functions/,

  // "Add any AWS service" categories that are not built on top of Data category.
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/analytics/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/geo/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/in-app-messaging/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/rest-api/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/predictions/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/interactions/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/pubsub/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/deletion-backup-resources/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/custom-resources/,
  /^https:\/\/docs\.amplify\.aws\/react\/build-a-backend\/add-aws-services\/overriding-resources/,

  // Q ...
  'https://docs.amplify.aws/react/build-a-backend/q-developer/',

  // Troubleshooting -- individual snippets will be added, since it would be hard to predict
  // what new troubleshooting pages might emerge that might be relevant.

  // All UI stuff.
  /^https:\/\/docs\.amplify\.aws\/react\/build-ui/,

  // Deploy and Host.
  // Some incidental snippets here. Leaving off the list for now so we can just ensure we're
  // notified if/when these snippets change. If this becomes noise, we can uncomment this:
  // /^https:\/\/docs\.amplify\.aws\/react\/deploy-and-host/,

  // Select Reference pages that are expected to have exclusively unrelated snippets.
  'https://docs.amplify.aws/react/reference/cli-commands/',
  'https://docs.amplify.aws/react/reference/iam-policy/',
  'https://docs.amplify.aws/react/reference/permissions-boundary/',
  'https://docs.amplify.aws/react/reference/telemetry/',

  // Non-docs content.
  /^https:\/\/docs\.amplify\.aws\/contribute/,

  // build-time. shows overriding AWS resources via the construct.
  'https://docs.amplify.aws/react/build-a-backend/data/override-resources/',

  // we'll cover outputs from snippets from the root "custom business logic" page in the local
  // defined=behavior tests, but not the individual sample AWS service integrations. we'll
  // anticipate these being covered either by e2e's or vetted by the DXE team (or whoever writes these).
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/',
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/',
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/',
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/',
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/',
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/',
  'https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/',
];

export const config: Config = {
  sitemapUrl: 'https://docs.amplify.aws/sitemap.xml',
  sitemapFilter: (path) =>
    !ingoredPaths.some((pathOrRegex) =>
      typeof pathOrRegex === 'string'
        ? path === pathOrRegex
        : pathOrRegex.test(path),
    ),
  testsDirectory,
  outputDirectory,
  openReportWhenDone: true,
};
