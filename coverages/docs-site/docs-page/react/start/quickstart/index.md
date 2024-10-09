[<- Back to index](../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/start/quickstart/

Coverage: 83.3%

#### `Unnamed Snippet`

~~~
├── amplify/ # Folder containing your Amplify backend configuration
│   ├── auth/ # Definition for your auth backend
│   │   └── resource.tsx
│   ├── data/ # Definition for your data backend
│   │   └── resource.ts
|   ├── backend.ts
│   └── tsconfig.json
├── src/ # React UI code
│   ├── App.tsx # UI code to sync todos in real-time
│   ├── index.css # Styling for your app
│   └── main.tsx # Entrypoint of the Amplify client library
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `ca66fb122174b9cc` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L9)

---

#### `Terminal`

~~~
git clone https://github.com/<github-user>/amplify-vite-react-template.git
cd amplify-vite-react-template && npm install

~~~

| | |
| -- | -- |
| Hash | `ed16cc50ccab928b` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L9)

---

#### `Unnamed Snippet`

~~~
├── amplify
├── src
├── amplify_outputs.json <== backend outputs file
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `008dc549768a46b2` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L9)

---

#### `src/App.tsx`

~~~
function App() {
  // ...
  function deleteTodo(id: string) {
client.models.Todo.delete({ id });
  }

  return (
<main>
  <h1>My todos</h1>
  <button onClick={createTodo}>+ new</button>
  <ul>
    {todos.map((todo) => (
<li onClick={() => deleteTodo(todo.id)} key={todo.id}>
  {todo.content}
</li>
    ))}
  </ul>
  <div>
    🥳 App successfully hosted. Try creating a new todo.
    <br />
    <a href="https://docs.amplify.aws/react/start/quickstart/">
Review next step of this tutorial.
    </a>
  </div>
</main>
  );
}

~~~

| | |
| -- | -- |
| Hash | `14bd2ab04fd722de` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/1-patterns/mutate-data.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/1-patterns/mutate-data.ts#L120)

---

#### `Terminal`

~~~
npm run dev

~~~

| | |
| -- | -- |
| Hash | `29238ffc8ab45ff8` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L9)

---

#### `src/main.tsx`

~~~
import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import App from "./App.tsx";
import outputs from "../amplify_outputs.json";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<Authenticator>
  <App />
</Authenticator>
  </React.StrictMode>,
);

~~~

| | |
| -- | -- |
| Hash | `4843a42677bbbe4e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `src/App.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();

  // ...

  return (
<main>
  {/* ... */}
  <button onClick={signOut}>Sign out</button>
</main>
  );
}

export default App;

~~~

| | |
| -- | -- |
| Hash | `1099eb31a7a597ff` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
git commit -am "added authenticator"
git push

~~~

| | |
| -- | -- |
| Hash | `f3e938672d9247e5` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L11)

---

#### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/common.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#L7)

---

#### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
// This tells the data client in your app (generateClient())
// to sign API requests with the user authentication token.
defaultAuthorizationMode: "userPool",
  },
});

~~~

| | |
| -- | -- |
| Hash | `832caa416eda81d3` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/2-expected-use/owner-fields.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/2-expected-use/owner-fields.ts#L38)

---

#### `src/App.tsx`

~~~
// ... imports

function App() {
  // ...
  return (
<Authenticator>
  {({ signOut, user }) => (
    <main>
<h1>{user?.signInDetails?.loginId}'s todos</h1>
{/* ... rest of the UI */}
    </main>
  )}
</Authenticator>
  );
}

~~~

| | |
| -- | -- |
| Hash | `a0636891d1ba0ef2` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L11)

---

#### `Terminal`

~~~
git commit -am "added per-user data isolation"
git push

~~~

| | |
| -- | -- |
| Hash | `c16d632aa0af79e6` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/start/quickstart.ts](../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/quickstart.ts#L11)

---

[<- Back to index](../../../../docs-pages.md)
