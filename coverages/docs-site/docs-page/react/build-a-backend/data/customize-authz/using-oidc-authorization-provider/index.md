[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/using-oidc-authorization-provider/

Coverage: 100.0%

#### `amplify/data/resource.ts`

~~~
// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [
  allow.owner("oidc").identityClaim("user_id"),
  allow.authenticated("oidc"),
  allow.groups(["testGroupName"], "oidc").withClaimIn("user_groups"),
]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "oidc",
oidcAuthorizationMode: {
  oidcProviderName: "oidc-provider-name",
  oidcIssuerUrl: "https://example.com",
  clientId: "client-id",
  tokenExpiryFromAuthInSeconds: 300,
  tokenExpireFromIssueInSeconds: 600,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `69256d377eecea21` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L218)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: todos } = await client.models.Todo.list({
  authMode: "oidc",
});

~~~

| | |
| -- | -- |
| Hash | `565011bb938244a7` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L51)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L161)

---

[<- Back to index](../../../../../../docs-pages.md)
