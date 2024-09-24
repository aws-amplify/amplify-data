[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/

Coverage: 0.0%

#### `amplify/data/resource.ts`

~~~
export const schema = a.schema({
  Customer: a
.model({
  name: a.string(),
  phoneNumber: a.phone(),
  accountRepresentativeId: a.id().required(),
})
.secondaryIndexes((index) => [index("accountRepresentativeId")])
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `22ba8c0684be1400` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import { type Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const { data, errors } =
  await client.models.Customer.listCustomerByAccountRepresentativeId({
accountRepresentativeId: "YOUR_REP_ID",
  });

~~~

| | |
| -- | -- |
| Hash | `00052f6a61b4a992` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
export const schema = a.schema({
  Customer: a
.model({
  name: a.string(),
  phoneNumber: a.phone(),
  accountRepresentativeId: a.id().required(),
})
.secondaryIndexes((index) => [
  index("accountRepresentativeId").sortKeys(["name"]),
])
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `956e34083f456707` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
const { data, errors } =
  await client.models.Customer.listCustomerByAccountRepresentativeIdAndName({
accountRepresentativeId: "YOUR_REP_ID",
name: {
  beginsWith: "Rene",
},
  });

~~~

| | |
| -- | -- |
| Hash | `d839094b3650525c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Customer: a
.model({
  name: a.string(),
  phoneNumber: a.phone(),
  accountRepresentativeId: a.id().required(),
})
.secondaryIndexes((index) => [
  index("accountRepresentativeId").queryField("listByRep"),
])
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `1b750f5a650f2978` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
const { data, errors } = await client.models.Customer.listByRep({
  accountRepresentativeId: "YOUR_REP_ID",
});

~~~

| | |
| -- | -- |
| Hash | `4df128e1af50d457` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Customer: a
.model({
  name: a.string(),
  phoneNumber: a.phone(),
  accountRepresentativeId: a.id().required(),
})
.secondaryIndexes((index) => [
  index("accountRepresentativeId").name("MyCustomIndexName"),
])
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `295dee0505f4abd0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
