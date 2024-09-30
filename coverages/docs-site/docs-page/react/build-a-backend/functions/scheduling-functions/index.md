[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/

Coverage: 0.0%

#### `amplify/jobs/weekly-digest/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const weeklyDigest = defineFunction({
  name: "weekly-digest",
  schedule: "every week",
});

~~~

| | |
| -- | -- |
| Hash | `de15993cea5f1fa1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/jobs/weekly-digest/handler.ts`

~~~
import type { EventBridgeHandler } from "aws-lambda";

export const handler: EventBridgeHandler<
  "Scheduled Event",
  null,
  void
> = async (event) => {
  console.log("event", JSON.stringify(event, null, 2));
};

~~~

| | |
| -- | -- |
| Hash | `749a0dacab70e531` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npm install --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `2ce7799b01b50156` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/jobs/generate-report/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const generateReport = defineFunction({
  name: "generate-report",
  schedule: ["every week", "every month", "every year"],
});

~~~

| | |
| -- | -- |
| Hash | `e33a2a8f247d9dc0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/jobs/drink-some-water/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h",
});

~~~

| | |
| -- | -- |
| Hash | `e82c8604acfdfe11` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/jobs/remind-me/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const remindMe = defineFunction({
  name: "remind-me",
  schedule: [
// every sunday at midnight
"every week",
// every tuesday at 5pm
"0 17 * ? 3 *",
// every wednesday at 5pm
"0 17 * ? 4 *",
// every thursday at 5pm
"0 17 * ? 5 *",
// every friday at 5pm
"0 17 * ? 6 *",
  ],
});

~~~

| | |
| -- | -- |
| Hash | `74e7e7b219d58ae9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/jobs/drink-some-water/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const drinkSomeWater = defineFunction({
  name: "drink-some-water",
  schedule: "every 1h",
});

~~~

| | |
| -- | -- |
| Hash | `e82c8604acfdfe11` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/jobs/remind-me/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const remindMe = defineFunction({
  name: "remind-me-to-take-the-trash-out",
  schedule: [
// every tuesday at 9am
"0 9 * ? 3 *",
// every friday at 9am
"0 9 * ? 6 *",
  ],
});

~~~

| | |
| -- | -- |
| Hash | `dffab3e54f80fdbb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
