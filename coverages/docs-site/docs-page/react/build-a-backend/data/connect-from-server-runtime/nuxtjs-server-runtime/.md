[<- Back to index](../../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/

Coverage: 0.0%

#### `nuxt-amplify-gen2/plugins/01.amplify-apis.client.ts`

~~~
import {
  fetchAuthSession,
  fetchUserAttributes,
  signIn,
  signOut,
  getCurrentUser,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";

// configure the Amplify client library
if (process.client) {
  Amplify.configure(outputs, { ssr: true });
}

// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

export default defineNuxtPlugin({
  name: "AmplifyAPIs",
  enforce: "pre",
  setup() {
return {
  provide: {
    // You can call the API by via the composable `useNuxtApp()`. For example:
    // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
    Amplify: {
Auth: {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
  signOut,
},
GraphQL: {
  client,
},
    },
  },
};
  },
});

~~~

| | |
| -- | -- |
| Hash | `cb5ac279a4f54149` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `nuxt-amplify-gen2/plugins/01.amplify-apis.server.ts`

~~~
import type { CookieRef } from "nuxt/app";
import {
  createKeyValueStorageFromCookieStorageAdapter,
  createUserPoolsTokenProvider,
  createAWSCredentialsAndIdentityIdProvider,
  runWithAmplifyServerContext,
} from "aws-amplify/adapter-core";
import { parseAmplifyConfig } from "aws-amplify/utils";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth/server";
import { generateClient } from "aws-amplify/data/server";
import type {
  LibraryOptions,
  FetchAuthSessionOptions,
} from "@aws-amplify/core";
import type {
  GraphQLOptionsV6,
  GraphQLResponseV6,
} from "@aws-amplify/api-graphql";

import outputs from "../amplify_outputs.json";

// parse the content of `amplify_outputs.json` into the shape of ResourceConfig
const amplifyConfig = parseAmplifyConfig(outputs);

// create the Amplify used token cookies names array
const userPoolClientId = amplifyConfig.Auth!.Cognito.userPoolClientId;
const lastAuthUserCookieName = `CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`;

// create a GraphQL client that can be used in a server context
const gqlServerClient = generateClient({ config: amplifyConfig });

const getAmplifyAuthKeys = (lastAuthUser: string) =>
  ["idToken", "accessToken", "refreshToken", "clockDrift"]
.map(
  (key) =>
    `CognitoIdentityServiceProvider.${userPoolClientId}.${lastAuthUser}.${key}`,
)
.concat(lastAuthUserCookieName);

// define the plugin
export default defineNuxtPlugin({
  name: "AmplifyAPIs",
  enforce: "pre",
  setup() {
// The Nuxt composable `useCookie` is capable of sending cookies to the
// client via the `SetCookie` header. If the `expires` option is left empty,
// it sets a cookie as a session cookie. If you need to persist the cookie
// on the client side after your end user closes your Web app, you need to
// specify an `expires` value.
//
// We use 30 days here as an example (the default Cognito refreshToken
// expiration time).
const expires = new Date();
expires.setDate(expires.getDate() + 30);

// Get the last auth user cookie value
//
// We use `sameSite: 'lax'` in this example, which allows the cookie to be
// sent to your Nuxt server when your end user gets redirected to your Web
// app from a different domain. You should choose an appropriate value for
// your own use cases.
const lastAuthUserCookie = useCookie(lastAuthUserCookieName, {
  sameSite: "lax",
  expires,
  secure: true,
});

// Get all Amplify auth token cookie names
const authKeys = lastAuthUserCookie.value
  ? getAmplifyAuthKeys(lastAuthUserCookie.value)
  : [];

// Create a key-value map of cookie name => cookie ref
//
// Using the composable `useCookie` here in the plugin setup prevents
// cross-request pollution.
const amplifyCookies = authKeys
  .map((name) => ({
    name,
    cookieRef: useCookie(name, { sameSite: "lax", expires, secure: true }),
  }))
  .reduce<Record<string, CookieRef<string | null | undefined>>>(
    (result, current) => ({
...result,
[current.name]: current.cookieRef,
    }),
    {},
  );

// Create a key value storage based on the cookies
//
// This key value storage is responsible for providing Amplify Auth tokens to
// the APIs that you are calling.
//
// If you implement the `set` method, when Amplify needed to refresh the Auth
// tokens on the server side, the new tokens would be sent back to the client
// side via `SetCookie` header in the response. Otherwise the refresh tokens
// would not be propagate to the client side, and Amplify would refresh
// the tokens when needed on the client side.
//
// In addition, if you decide not to implement the `set` method, you don't
// need to pass any `CookieOptions` to the `useCookie` composable.
const keyValueStorage = createKeyValueStorageFromCookieStorageAdapter({
  get(name) {
    const cookieRef = amplifyCookies[name];

    if (cookieRef && cookieRef.value) {
return { name, value: cookieRef.value };
    }

    return undefined;
  },
  getAll() {
    return Object.entries(amplifyCookies).map(([name, cookieRef]) => {
return { name, value: cookieRef.value ?? undefined };
    });
  },
  set(name, value) {
    const cookieRef = amplifyCookies[name];
    if (cookieRef) {
cookieRef.value = value;
    }
  },
  delete(name) {
    const cookieRef = amplifyCookies[name];

    if (cookieRef) {
cookieRef.value = null;
    }
  },
});

// Create a token provider
const tokenProvider = createUserPoolsTokenProvider(
  amplifyConfig.Auth!,
  keyValueStorage,
);

// Create a credentials provider
const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(
  amplifyConfig.Auth!,
  keyValueStorage,
);

// Create the libraryOptions object
const libraryOptions: LibraryOptions = {
  Auth: {
    tokenProvider,
    credentialsProvider,
  },
};

return {
  provide: {
    // You can add the Amplify APIs that you will use on the server side of
    // your Nuxt app here. You must only use the APIs exported from the
    // `aws-amplify/<category>/server` subpaths.
    //
    // You can call the API by via the composable `useNuxtApp()`. For example:
    // `useNuxtApp().$Amplify.Auth.fetchAuthSession()`
    //
    // Recall that Amplify server APIs are required to be called in a isolated
    // server context that is created by the `runWithAmplifyServerContext`
    // function.
    Amplify: {
Auth: {
  fetchAuthSession: (options: FetchAuthSessionOptions) =>
    runWithAmplifyServerContext(
      amplifyConfig,
      libraryOptions,
      (contextSpec) => fetchAuthSession(contextSpec, options),
    ),
  fetchUserAttributes: () =>
    runWithAmplifyServerContext(
      amplifyConfig,
      libraryOptions,
      (contextSpec) => fetchUserAttributes(contextSpec),
    ),
  getCurrentUser: () =>
    runWithAmplifyServerContext(
      amplifyConfig,
      libraryOptions,
      (contextSpec) => getCurrentUser(contextSpec),
    ),
},
GraphQL: {
  client: {
    // Follow this typing to ensure the`graphql` API return type can
    // be inferred correctly according to your queries and mutations
    graphql: <
      FALLBACK_TYPES = unknown,
      TYPED_GQL_STRING extends string = string,
    >(
      options: GraphQLOptionsV6<FALLBACK_TYPES, TYPED_GQL_STRING>,
      additionalHeaders?: Record<string, string>,
    ) =>
      runWithAmplifyServerContext<
        GraphQLResponseV6<FALLBACK_TYPES, TYPED_GQL_STRING>
      >(amplifyConfig, libraryOptions, (contextSpec) =>
        gqlServerClient.graphql(
          contextSpec,
          options,
          additionalHeaders,
        ),
      ),
  },
},
    },
  },
};
  },
});

~~~

| | |
| -- | -- |
| Hash | `61be5ecc2b85a7e6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `nuxt-amplify-gen2/app.vue`

~~~
<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '@/amplify/data/resource';

// create a reactive reference to the array of todos
const todos = ref<Schema['Todo']['type'][]>([]);

async function listTodos() {
 try {
// `$Amplify` is generated by Nuxt according to the `provide` key in the plugins
// fetch all todos
const { data } = await useNuxtApp().$Amplify.GraphQL.client.models.Todo.list();
todos.value = data;

  } catch (error) {
 console.error('Error fetching todos', error);
  }
}

// fetch todos when the component is mounted
onMounted(() => {
  listTodos();
});
</script>


<template>
  <Authenticator>
<template v-slot="{ user, signOut }">
  <h1>Hello, Amplify 👋</h1>
    <ul>
<li v-for="todo in todos" :key="todo.id">{{ todo.content }}</li>
    </ul>
  <button @click="signOut">Sign Out</button>
</template>
  </Authenticator>
</template>

~~~

| | |
| -- | -- |
| Hash | `bd1771c2b15c6283` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `nuxt-amplify-gen2/server/utils/amplifyUtils.ts`

~~~
import type { H3Event, EventHandlerRequest } from "h3";
import {
  createKeyValueStorageFromCookieStorageAdapter,
  createUserPoolsTokenProvider,
  createAWSCredentialsAndIdentityIdProvider,
  runWithAmplifyServerContext,
  AmplifyServer,
  CookieStorage,
} from "aws-amplify/adapter-core";
import { parseAmplifyConfig } from "aws-amplify/utils";

import type { LibraryOptions } from "@aws-amplify/core";
import outputs from "~/amplify_outputs.json";

const amplifyConfig = parseAmplifyConfig(outputs);

const createCookieStorageAdapter = (
  event: H3Event<EventHandlerRequest>,
): CookieStorage.Adapter => {
  // `parseCookies`, `setCookie` and `deleteCookie` are Nuxt provided functions
  const readOnlyCookies = parseCookies(event);

  return {
get(name) {
  if (readOnlyCookies[name]) {
    return { name, value: readOnlyCookies[name] };
  }
},
set(name, value, options) {
  setCookie(event, name, value, options);
},
delete(name) {
  deleteCookie(event, name);
},
getAll() {
  return Object.entries(readOnlyCookies).map(([name, value]) => {
    return { name, value };
  });
},
  };
};

const createLibraryOptions = (
  event: H3Event<EventHandlerRequest>,
): LibraryOptions => {
  const cookieStorage = createCookieStorageAdapter(event);
  const keyValueStorage =
createKeyValueStorageFromCookieStorageAdapter(cookieStorage);
  const tokenProvider = createUserPoolsTokenProvider(
amplifyConfig.Auth!,
keyValueStorage,
  );
  const credentialsProvider = createAWSCredentialsAndIdentityIdProvider(
amplifyConfig.Auth!,
keyValueStorage,
  );

  return {
Auth: {
  tokenProvider,
  credentialsProvider,
},
  };
};

export const runAmplifyApi = <Result,>(
  // we need the event object to create a context accordingly
  event: H3Event<EventHandlerRequest>,
  operation: (
contextSpec: AmplifyServer.ContextSpec,
  ) => Result | Promise<Result>,
) => {
  return runWithAmplifyServerContext<Result>(
amplifyConfig,
createLibraryOptions(event),
operation,
  );
};

~~~

| | |
| -- | -- |
| Hash | `b69a0709fb18f82d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `nuxt-amplify-gen2/server/api/current-user.ts`

~~~
import { getCurrentUser } from "aws-amplify/auth/server";
import { runAmplifyApi } from "~/server/utils/amplifyUtils";

export default defineEventHandler(async (event) => {
  const user = await runAmplifyApi(event, (contextSpec) =>
getCurrentUser(contextSpec),
  );

  return user;
});

~~~

| | |
| -- | -- |
| Hash | `9c6d35de6c41c090` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../../docs-pages.md)
