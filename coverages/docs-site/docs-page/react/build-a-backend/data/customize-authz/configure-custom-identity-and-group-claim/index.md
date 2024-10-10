[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/

Coverage: 100.0%

#### `amplify/data/resource.ts`

~~~
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
.model({
  id: a.id(),
  owner: a.string(),
  postname: a.string(),
  content: a.string(),
})
.authorization((allow) => [
  allow.owner().identityClaim("user_id"),
  allow.groups(["Moderator"]).withClaimIn("user_groups"),
]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({ schema });

~~~

| | |
| -- | -- |
| Hash | `97e7b3e58b77c840` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/auth-rules.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/auth-rules.ts#L253)

---

#### `Unnamed Snippet`

~~~
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource'; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
postname: 'My New Post'
content: 'My post content',
  },
  {
authMode: 'userPool',
  }
);

~~~

| | |
| -- | -- |
| Hash | `89231235f277e013` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L50)
- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/auth-modes.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/auth-modes.ts#L160)

---

[<- Back to index](../../../../../../docs-pages.md)
