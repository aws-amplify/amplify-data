[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  done: a.boolean(),
  priority: a.enum(["low", "medium", "high"]),
})
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `7232741075ac9a15` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

const backend = defineBackend({
  auth,
  data,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

~~~

| | |
| -- | -- |
| Hash | `bb35bdd46b7971d7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

~~~

| | |
| -- | -- |
| Hash | `8354d1d65db14803` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "opensearch-backup-bucket-amplify-gen-2",
  access: (allow) => ({
"public/*": [allow.guest.to(["list", "write", "get"])],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `8fb723fa5214c0fc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";

import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";

// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});
// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

~~~

| | |
| -- | -- |
| Hash | `4b1b576c9c3ec7c7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";

// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

// Define OpenSearch index mappings
const indexName = "todo";

const indexMapping = {
  settings: {
number_of_shards: 1,
number_of_replicas: 0,
  },
  mappings: {
properties: {
  id: {
    type: "keyword",
  },
  done: {
    type: "boolean",
  },
  content: {
    type: "text",
  },
},
  },
};

~~~

| | |
| -- | -- |
| Hash | `c4a088f13f0aa0c6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";

// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

// Define OpenSearch index mappings
const indexName = "todo";

const indexMapping = {
  settings: {
number_of_shards: 1,
number_of_replicas: 0,
  },
  mappings: {
properties: {
  id: {
    type: "keyword",
  },
  isDone: {
    type: "boolean",
  },
  content: {
    type: "text",
  },
  priority: {
    type: "text",
  },
},
  },
};

// OpenSearch template definition
const openSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
dynamodb:
  acknowledgments: true
  tables:
    - table_arn: "${tableArn}"
stream:
  start_position: "LATEST"
export:
  s3_bucket: "${s3BucketName}"
  s3_region: "${region}"
  s3_prefix: "${tableName}/"
  aws:
    sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
    region: "${region}"
  sink:
- opensearch:
    hosts:
- "https://${openSearchDomain.domainEndpoint}"
    index: "${indexName}"
    index_type: "custom"
    template_content: |
${JSON.stringify(indexMapping)}
    document_id: '\${getMetadata("primary_key")}'
    action: '\${getMetadata("opensearch_action")}'
    document_version: '\${getMetadata("document_version")}'
    document_version_type: "external"
    bulk_size: 4
    aws:
sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
region: "${region}"
`;

~~~

| | |
| -- | -- |
| Hash | `404e714f1ab48643` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";
import * as osis from "aws-cdk-lib/aws-osis";
import * as logs from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";
// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

// Define OpenSearch index mappings
const indexName = "todo";

const indexMapping = {
  settings: {
number_of_shards: 1,
number_of_replicas: 0,
  },
  mappings: {
properties: {
  id: {
    type: "keyword",
  },
  isDone: {
    type: "boolean",
  },
  content: {
    type: "text",
  },
  priority: {
    type: "text",
  },
},
  },
};

// OpenSearch template definition
const openSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
dynamodb:
  acknowledgments: true
  tables:
    - table_arn: "${tableArn}"
stream:
  start_position: "LATEST"
export:
  s3_bucket: "${s3BucketName}"
  s3_region: "${region}"
  s3_prefix: "${tableName}/"
  aws:
    sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
    region: "${region}"
  sink:
- opensearch:
    hosts:
- "https://${openSearchDomain.domainEndpoint}"
    index: "${indexName}"
    index_type: "custom"
    template_content: |
${JSON.stringify(indexMapping)}
    document_id: '\${getMetadata("primary_key")}'
    action: '\${getMetadata("opensearch_action")}'
    document_version: '\${getMetadata("document_version")}'
    document_version_type: "external"
    bulk_size: 4
    aws:
sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
region: "${region}"
`;

// Create a CloudWatch log group
const logGroup = new logs.LogGroup(dataStack, "LogGroup", {
  logGroupName: "/aws/vendedlogs/OpenSearchService/pipelines/1",
  removalPolicy: RemovalPolicy.DESTROY,
});

// Create an OpenSearch Integration Service pipeline
const cfnPipeline = new osis.CfnPipeline(
  dataStack,
  "OpenSearchIntegrationPipeline",
  {
maxUnits: 4,
minUnits: 1,
pipelineConfigurationBody: openSearchTemplate,
pipelineName: "dynamodb-integration-2",
logPublishingOptions: {
  isLoggingEnabled: true,
  cloudWatchLogDestination: {
    logGroup: logGroup.logGroupName,
  },
},
  },
);

~~~

| | |
| -- | -- |
| Hash | `3d16597aaa312cfc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/backend.ts`

~~~
// Add OpenSearch data source
const osDataSource = backend.data.addOpenSearchDataSource(
  "osDataSource",
  openSearchDomain,
);

~~~

| | |
| -- | -- |
| Hash | `73fa3092c82ab57b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/searchTodoResolver.js`

~~~
import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */

export function request(ctx) {
  return {
operation: "GET",
path: "/todo/_search",
  };
}

/**
 * Returns the fetched items
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */

export function response(ctx) {
  if (ctx.error) {
util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.hits.hits.map((hit) => hit._source);
}

~~~

| | |
| -- | -- |
| Hash | `687bb0ef861889da` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  done: a.boolean(),
  priority: a.enum(["low", "medium", "high"]),
})
.authorization((allow) => [allow.publicApiKey()]),

  searchTodos: a
.query()
.returns(a.ref("Todo").array())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    entry: "./searchTodoResolver.js",
    dataSource: "osDataSource",
  }),
),
});

~~~

| | |
| -- | -- |
| Hash | `d4394d9ad36ac2df` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
