[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/

Coverage: 25.0%

#### `Unnamed Snippet`

~~~
import { type Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import outputs from "@/amplify_outputs.json";
import { cookies } from "next/headers";

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

~~~

| | |
| -- | -- |
| Hash | `3c5526f4c791ccdb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { type Schema } from "@/amplify/data/resource";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { generateServerClientUsingReqRes } from "@aws-amplify/adapter-nextjs/data";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

export const reqResBasedClient = generateServerClientUsingReqRes<Schema>({
  config: outputs,
});

~~~

| | |
| -- | -- |
| Hash | `062b069c31e86ca5` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/3-exhaustive/ssr-req-res-client.ts](../../../../../../../../packages/integration-tests/__tests__/defined-behavior/3-exhaustive/ssr-req-res-client.ts#L108)

---

#### `Unnamed Snippet`

~~~
import { type Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import outputs from "@/amplify_outputs.json";
import { cookies } from "next/headers";

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

const fetchTodos = async () => {
  const { data: todos, errors } = await cookieBasedClient.models.Todo.list();

  if (!errors) {
return todos;
  }
};

~~~

| | |
| -- | -- |
| Hash | `a141a840aa01929c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Unnamed Snippet`

~~~
import { type Schema } from "@/amplify/data/resource";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  runWithAmplifyServerContext,
  reqResBasedClient,
} from "@/utils/amplifyServerUtils";

type ResponseData = {
  todos: Schema["Todo"]["type"][];
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  const todos = await runWithAmplifyServerContext({
nextServerContext: { request, response },
operation: async (contextSpec) => {
  const { data: todos } =
    await reqResBasedClient.models.Todo.list(contextSpec);
  return todos;
},
  });

  response.status(200).json({ todos });
}

~~~

| | |
| -- | -- |
| Hash | `b92d612b55a6ab9f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
