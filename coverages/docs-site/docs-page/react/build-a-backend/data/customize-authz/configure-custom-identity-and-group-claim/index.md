[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/

Coverage: 0.0%

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
| Covered | ❌ |

##### Covering Regions

- *None*

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
