[<- Back to index](../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/how-amplify-works/concepts/

Coverage: 66.7%

#### `Unnamed Snippet`

~~~
const schema = a.schema({
  Chat: a.model({
name: a.string(),
message: a.hasMany("Message", "chatId"),
  }),
  Message: a.model({
text: a.string(),
chat: a.belongsTo("Chat", "chatId"),
chatId: a.id(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `821a39b70747c164` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

// list all messages
const { data } = await client.models.Message.list();

// create a new message
const { errors, data: newMessage } = await client.models.Message.create({
  text: "My message text",
});

~~~

| | |
| -- | -- |
| Hash | `b9d80a938dc6ed37` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `amplify/auth/resource.ts`

~~~
export const auth = defineAuth({
  loginWith: {
email: {
  verificationEmailSubject: "Welcome 👋 Verify your email!",
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `a37b0e8fc70f7954` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/how-amplify-works/concepts.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/how-amplify-works/concepts.ts#9)

---

#### `Unnamed Snippet`

~~~
import { withAuthenticator } from "@aws-amplify/ui-react";

function App({ signOut, user }) {
  return (
<>
  <h1>Hello {user.username}</h1>
  <button onClick={signOut}>Sign out</button>
</>
  );
}

export default withAuthenticator(App);

~~~

| | |
| -- | -- |
| Hash | `278fc5fceaa75c35` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/how-amplify-works/concepts.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/how-amplify-works/concepts.ts#9)

---

#### `Unnamed Snippet`

~~~
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as locations from "aws-cdk-lib/aws-location";
import { Construct } from "constructs";

export class LocationMapStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
super(scope, id, props);

// Create the map resource
const map = new locations.CfnMap(this, "LocationMap", {
  configuration: {
    style: "VectorEsriStreets", // map style
  },
  description: "My Location Map",
  mapName: "MyMap",
});

new CfnOutput(this, "mapArn", {
  value: map.attrArn,
  exportName: "mapArn",
});
  }
}

~~~

| | |
| -- | -- |
| Hash | `3a46e2923a54b214` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/how-amplify-works/concepts.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/how-amplify-works/concepts.ts#9)

---

#### `Unnamed Snippet`

~~~
import { Backend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { LocationMapStack } from "./locationMapStack/resource";

const backend = new Backend({
  auth,
  data,
});

new LocationMapStack(
  backend.getStack("LocationMapStack"),
  "myLocationResource",
  {},
);

~~~

| | |
| -- | -- |
| Hash | `507842e09e0f3a5c` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/how-amplify-works/concepts.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/how-amplify-works/concepts.ts#9)

---

[<- Back to index](../../../../docs-pages.md)
