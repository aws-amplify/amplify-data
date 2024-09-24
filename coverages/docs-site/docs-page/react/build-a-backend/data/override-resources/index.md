[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/override-resources/

Coverage: 0.0%

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";

const backend = defineBackend({
  data,
});

const dataResources = backend.data.resources;

Object.values(dataResources.cfnResources.amplifyDynamoDbTables).forEach(
  (table) => {
table.pointInTimeRecoveryEnabled = true;
  },
);

~~~

| | |
| -- | -- |
| Hash | `ff73e9e8bc4d231c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";

const backend = defineBackend({
  data,
});

const dataResources = backend.data.resources;

dataResources.cfnResources.cfnGraphqlApi.xrayEnabled = true;

~~~

| | |
| -- | -- |
| Hash | `aa8e04a6a0f517cc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";

const backend = defineBackend({
  data,
});

const dataResources = backend.data.resources;

dataResources.cfnResources.amplifyDynamoDbTables["Todo"].timeToLiveAttribute = {
  attributeName: "ttl",
  enabled: true,
};

~~~

| | |
| -- | -- |
| Hash | `f80c2100ba23a11b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";

const backend = defineBackend({
  data,
});
const dataResources = backend.data.resources;

dataResources.cfnResources.amplifyDynamoDbTables["Todo"].billingMode =
  BillingMode.PAY_PER_REQUEST;

~~~

| | |
| -- | -- |
| Hash | `af89dbfebfd5de7c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";

const backend = defineBackend({
  data,
});

const dataResources = backend.data.resources;

dataResources.cfnResources.amplifyDynamoDbTables["Todo"].provisionedThroughput =
  {
readCapacityUnits: 5,
writeCapacityUnits: 5,
  };

~~~

| | |
| -- | -- |
| Hash | `1ba844bb9738379e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";

const backend = defineBackend({
  data,
});

const dataResources = backend.data.resources;

dataResources.cfnResources.amplifyDynamoDbTables[
  "Todo"
].pointInTimeRecoveryEnabled = true;

~~~

| | |
| -- | -- |
| Hash | `4acf111e12150874` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
