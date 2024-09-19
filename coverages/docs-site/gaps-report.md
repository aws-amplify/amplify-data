[<- Back to summary](summary.md)

# Uncovered Docs Snippets

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
npm create amplify@latest

~~~

| | |
| -- | -- |
| Hash | `49c40ffdf76ab492` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
? Where should we create your project? (.) # press enter

~~~

| | |
| -- | -- |
| Hash | `d8b7d661117c2360` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Unnamed Snippet`

~~~
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   ├── tsconfig.json
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `ce40c8a92db3a16a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
npm add --save-dev @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript

~~~

| | |
| -- | -- |
| Hash | `1ee5fa5533406d7c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Unnamed Snippet`

~~~
import { defineBackend } from "@aws-amplify/backend";

defineBackend({});

~~~

| | |
| -- | -- |
| Hash | `4c4780536e17d44f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Unnamed Snippet`

~~~
The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import("@aws-amplify/backend")' call instead.

~~~

| | |
| -- | -- |
| Hash | `46e660ca9e2b4a99` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Unnamed Snippet`

~~~
{
  "type": "module"
}

~~~

| | |
| -- | -- |
| Hash | `3ca9d4afd2142508` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
});

~~~

| | |
| -- | -- |
| Hash | `ffe5e69116dbb94f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/project-structure/](https://docs.amplify.aws/react/reference/project-structure/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
});

~~~

| | |
| -- | -- |
| Hash | `ffe5e69116dbb94f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `amplify/data/resource.ts`

~~~
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `b497a376ca20c1f5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  data,
});

~~~

| | |
| -- | -- |
| Hash | `c754d0fa4a8944d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/project-structure/](https://docs.amplify.aws/react/reference/project-structure/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

defineBackend({
  auth,
  data,
});

~~~

| | |
| -- | -- |
| Hash | `c754d0fa4a8944d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
npm update @aws-amplify/backend@latest @aws-amplify/backend-cli@latest

~~~

| | |
| -- | -- |
| Hash | `e02df4dc8f85e45e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `CloudShell`

~~~
read -p "Enter email address: " user_email # hit enter

~~~

| | |
| -- | -- |
| Hash | `41bd29a5a3cfeebd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Unnamed Snippet`

~~~
Enter email address: <your-email-address>

~~~

| | |
| -- | -- |
| Hash | `4d8dd49ba8bbad6c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `CloudShell`

~~~
response=$(aws sso-admin list-instances)
ssoId=$(echo $response | jq '.Instances[0].IdentityStoreId' -r)
ssoArn=$(echo $response | jq '.Instances[0].InstanceArn' -r)
email_json=$(jq -n --arg email "$user_email" '{"Type":"Work","Value":$email}')
response=$(aws identitystore create-user --identity-store-id $ssoId --user-name amplify-admin --display-name 'Amplify Admin' --name Formatted=string,FamilyName=Admin,GivenName=Amplify --emails "$email_json")
userId=$(echo $response | jq '.UserId' -r)
response=$(aws sso-admin create-permission-set --name amplify-policy --instance-arn=$ssoArn --session-duration PT12H)
permissionSetArn=$(echo $response | jq '.PermissionSet.PermissionSetArn' -r)
aws sso-admin attach-managed-policy-to-permission-set --instance-arn $ssoArn --permission-set-arn $permissionSetArn --managed-policy-arn arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess
accountId=$(aws sts get-caller-identity | jq '.Account' -r)
aws sso-admin create-account-assignment --instance-arn $ssoArn --target-id $accountId --target-type AWS_ACCOUNT --permission-set-arn $permissionSetArn --principal-type USER --principal-id $userId
# Hit enter

~~~

| | |
| -- | -- |
| Hash | `eb84571cf12fe908` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `CloudShell`

~~~
printf "\n\nStart session url: https://$ssoId.awsapps.com/start\nRegion: $AWS_REGION\nUsername: amplify-admin\n\n"

# you should see
Start session url: https://d-XXXXXXXXXX.awsapps.com/start
Region: us-east-1
Username: amplify-admin

~~~

| | |
| -- | -- |
| Hash | `d65728cc9f2d35e2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Unnamed Snippet`

~~~
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install -i /usr/local/aws-cli -b /usr/local/bin

~~~

| | |
| -- | -- |
| Hash | `d02e9eafb1be48d8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Terminal`

~~~
aws configure sso

| SSO session name (Recommended): amplify-admin
| SSO start URL: <START SESSION URL>
| SSO region: <your-region>
| SSO registration scopes [sso:account:access]: <leave blank>
| Attempting to automatically open the SSO authorization page in your default browser.
| If the browser does not open or you wish to use a different device to authorize this request, open the following URL:
|
| https://device.sso.us-east-2.amazonaws.com/
|
| Then enter the code:
|
| SOME-CODE

## browser opens

~~~

| | |
| -- | -- |
| Hash | `67df689e3583a0a1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Terminal`

~~~
The only AWS account available to you is: <your-aws-account-id>
Using the account ID <your-aws-account-id>
The only role available to you is: amplify-policy
Using the role name "amplify-policy"
CLI default client Region [us-east-1]: <your-region>
CLI default output format [None]:

~~~

| | |
| -- | -- |
| Hash | `fdde335b915b8d00` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Terminal`

~~~
CLI profile name [amplify-policy-<your-aws-account-id>]: default
To use this profile, specify the profile name using --profile, as shown:

aws s3 ls --profile default

~~~

| | |
| -- | -- |
| Hash | `5b7ec5f24c0948b6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `~/.aws/config`

~~~
[profile default]
sso_session = amplify-admin
sso_account_id = <your-aws-account-id>
sso_role_name = AdministratorAccess
region = <your-region>
[sso-session amplify-admin]
sso_start_url = https://xxxxxx.awsapps.com/start#
sso_region = <your-region>
sso_registration_scopes = sso:account:access

~~~

| | |
| -- | -- |
| Hash | `4605860b47ab2f3f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Terminal`

~~~
npx ampx sandbox

# OR

npx ampx sandbox --profile <profile-name>

~~~

| | |
| -- | -- |
| Hash | `839d7e4495deeaf5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox --profile <value>

~~~

| | |
| -- | -- |
| Hash | `8c8f1482d8698a80` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nextjs-server-runtime/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from "./schema.sql";

// Add a global authorization rule
const sqlSchema = generatedSqlSchema.authorization((allow) => allow.guest());

// Relational database sources can coexist with DynamoDB tables managed by Amplify.
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.guest()]),
});

// Use the a.combine() operator to stitch together the models backed by DynamoDB
// and the models backed by Postgres or MySQL databases.
const combinedSchema = a.combine([schema, sqlSchema]);

// Don't forget to update your client types to take into account the types from
// both schemas.
export type Schema = ClientSchema<typeof combinedSchema>;

export const data = defineData({
  // Update the data definition to use the combined schema, instead of just
  // your DynamoDB-backed schema
  schema: combinedSchema,
});

~~~

| | |
| -- | -- |
| Hash | `36f544daf9ca0bc2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
// Add an authorization rule to the schema
const sqlSchema = generatedSqlSchema.setAuthorization((models) => [
  // Model-level authorization rules
  models.event.authorization((allow) => [allow.publicApiKey()]),
  // Field-level authorization rules
  models.event.fields.id.authorization((allow) => [
allow.publicApiKey(),
allow.guest(),
  ]),
  models.event.fields.created_at.authorization((allow) => [
allow.publicApiKey(),
allow.guest(),
  ]),
]);

~~~

| | |
| -- | -- |
| Hash | `8ae1c7b151eacfde` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/)

##### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
const { data: events } = await client.models.event.list();

~~~

| | |
| -- | -- |
| Hash | `d9dc661c8e8c0dd4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
// Rename models or fields to be more idiomatic for frontend code
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .renameModels(() => [
//⌄⌄⌄⌄⌄ existing model name based on table name
["event", "Event"],
//        ^^^^^^ renamed data model name
  ]);

~~~

| | |
| -- | -- |
| Hash | `748c6c140a7867a7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .setRelationships((models) => [
models.Note.relationships({
  comments: a.hasMany("Comment", "note_id"),
}),
models.Comment.relationships({
  note: a.belongsTo("Note", "note_id"),
}),
  ]);

~~~

| | |
| -- | -- |
| Hash | `4ac6eb92952f0637` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
// Add custom mutations or queries that execute SQL statements
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .addToSchema({
listEventsWithDecodedLatLong: a
  .query()
  // reference custom types added to the schema
  .returns(a.ref("EventWithDecodedCoord").array())
  .handler(
    a.handler.inlineSql(
`SELECT
  id,
  name,
  address,
  ST_X(geom) AS longitude,
  ST_Y(geom) AS latitude
FROM locations;`,
    ),
  )
  .authorization((allow) => [allow.guest()]),

// Define custom types to provide end-to-end typed results
// for custom queries / mutations
EventWithDecodedCoord: a.customType({
  id: a.integer(),
  name: a.string(),
  address: a.string(),
  longitude: a.float(),
  latitude: a.float(),
}),
  });

~~~

| | |
| -- | -- |
| Hash | `5071d6595a7426a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
const sqlSchema = generatedSqlSchema
  .authorization((allow) => allow.guest())
  .addToSchema({
createNewLocationWithLongLat: a
  .mutation()
  .arguments({
    lat: a.float().required(),
    long: a.float().required(),
    name: a.string().required(),
    address: a.string().required(),
  })
  .returns(a.json().array())
  .authorization((allow) => allow.authenticated())
  .handler(a.handler.sqlReference("./createNewLocationWithLongLat.sql")),
  });

~~~

| | |
| -- | -- |
| Hash | `26ed39c38206c91e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `createNewLocationWithLongLat.sql`

~~~
INSERT INTO locations (name, address, geom)
VALUES (:name, :address, ST_GEOMFROMTEXT(CONCAT('POINT (', :long, ' ', :lat, ')'), 4326));

~~~

| | |
| -- | -- |
| Hash | `62da717f535147ae` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `createNewLocationWithLongLat.sql`

~~~
INSERT INTO locations (name, address, geom)
VALUES (:name, :address, ST_SetSRID(ST_MakePoint(:long, :lat), 4326))

~~~

| | |
| -- | -- |
| Hash | `34cb4b8726c31609` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
getPostBySlug: a.query()
  .arguments({
slug: a.string().required(),
  })
  .returns(a.ref("Post").array())
  .handler(
a.handler.inlineSql(`
SELECT id, title, slug, content, created_at, updated_at
FROM posts
WHERE slug = :slug;
`),
  );

~~~

| | |
| -- | -- |
| Hash | `f36866db1e6435b0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
  Post: a.customType({
id: a.id().required(),
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `a19235ddde928883` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { aws_dynamodb } from "aws-cdk-lib";

export const backend = defineBackend({
  auth,
  data,
});

const externalDataSourcesStack = backend.createStack("MyExternalDataSources");

const externalTable = aws_dynamodb.Table.fromTableName(
  externalDataSourcesStack,
  "MyExternalPostTable",
  "PostTable",
);

backend.data.addDynamoDbDataSource(
  "ExternalPostTableDataSource",
  externalTable,
);

~~~

| | |
| -- | -- |
| Hash | `162d8b8ed28fe6ce` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  addPost: a
.mutation()
.arguments({
  id: a.id(),
  author: a.string().required(),
  title: a.string(),
  content: a.string(),
  url: a.string(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./addPost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `82af3812a4845b9f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  getPost: a
.query()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./getPost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `cc413eca4d74c0c0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  updatePost: a
.mutation()
.arguments({
  id: a.id().required(),
  author: a.string(),
  title: a.string(),
  content: a.string(),
  url: a.string(),
  expectedVersion: a.integer().required(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./updatePost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `514c919cbbf2741d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
author: a.string().required(),
title: a.string(),
content: a.string(),
url: a.string(),
ups: a.integer(),
downs: a.integer(),
version: a.integer(),
  }),
  deletePost: a
.mutation()
.arguments({ id: a.id().required(), expectedVersion: a.integer() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "ExternalPostTableDataSource",
    entry: "./deletePost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `7511ba489422cbaa` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/addPost.js`

~~~
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const item = { ...ctx.arguments, ups: 1, downs: 0, version: 1 };
  const key = { id: ctx.args.id ?? util.autoId() };
  return ddb.put({ key, item });
}

export function response(ctx) {
  return ctx.result;
}

~~~

| | |
| -- | -- |
| Hash | `78d0e40a38210ca2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/getPost.js`

~~~
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return ddb.get({ key: { id: ctx.args.id } });
}

export const response = (ctx) => ctx.result;

~~~

| | |
| -- | -- |
| Hash | `852c18d3beb6e876` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/updatePost.js`

~~~
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { id, expectedVersion, ...rest } = ctx.args;
  const values = Object.entries(rest).reduce((obj, [key, value]) => {
obj[key] = value ?? ddb.operations.remove();
return obj;
  }, {});

  return ddb.update({
key: { id },
condition: { version: { eq: expectedVersion } },
update: { ...values, version: ddb.operations.increment(1) },
  });
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
util.appendError(error.message, error.type);
  }
  return result;
}

~~~

| | |
| -- | -- |
| Hash | `01edcc7a4e9a3ad1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `amplify/data/deletePost.js`

~~~
import { util } from "@aws-appsync/utils";
import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  let condition = null;
  if (ctx.args.expectedVersion) {
condition = {
  or: [
    { id: { attributeExists: false } },
    { version: { eq: ctx.args.expectedVersion } },
  ],
};
  }
  return ddb.remove({ key: { id: ctx.args.id }, condition });
}

export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
util.appendError(error.message, error.type);
  }
  return result;
}

~~~

| | |
| -- | -- |
| Hash | `333eae9033374c42` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `App.tsx`

~~~
const { data, errors } = await client.mutations.addPost({
  title: "My Post",
  content: "My Content",
  author: "Chris",
});

~~~

| | |
| -- | -- |
| Hash | `e2421a40800acfac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `App.tsx`

~~~
const { data, errors } = await client.mutations.addPost({
  title: "My Post",
  content: "My Content",
  author: "Chris",
});

~~~

| | |
| -- | -- |
| Hash | `e2421a40800acfac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `App.tsx`

~~~
const { data, errors } = await client.queries.getPost({
  id: "<post-id>",
});

~~~

| | |
| -- | -- |
| Hash | `8c001c6c1cc91d00` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `App.tsx`

~~~
const { data, errors } = await client.queries.getPost({
  id: "<post-id>",
});

~~~

| | |
| -- | -- |
| Hash | `8c001c6c1cc91d00` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `App.tsx`

~~~
const { data, errors } = await client.mutations.updatePost({
  id: "<post-id>",
  title: "An Updated Post",
  expectedVersion: 1,
});

~~~

| | |
| -- | -- |
| Hash | `f5328ca32d825139` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `App.tsx`

~~~
const { data, errors } = await client.mutations.deletePost({
  id: "<post-id>",
});

~~~

| | |
| -- | -- |
| Hash | `0eefd1ef7277ba0d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `App.tsx`

~~~
const { data, errors } = await client.mutations.deletePost({
  id: "<post-id>",
});

~~~

| | |
| -- | -- |
| Hash | `0eefd1ef7277ba0d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
export function request(ctx) {
  const { foo, bar } = ctx.args;
  return {
operation: "GetItem",
key: util.dynamodb.toMapValues({ foo, bar }),
consistentRead: true,
  };
}

~~~

| | |
| -- | -- |
| Hash | `c2ad4a885704896a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { foo, bar, ...values } = ctx.args;
  return {
operation: "PutItem",
key: util.dynamodb.toMapValues({ foo, bar }),
attributeValues: util.dynamodb.toMapValues(values),
  };
}

~~~

| | |
| -- | -- |
| Hash | `ac99ec3cff825ff6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { id } = ctx.args;
  return {
operation: "UpdateItem",
key: util.dynamodb.toMapValues({ id }),
update: {
  expression: "ADD #voteField :plusOne, version :plusOne",
  expressionNames: { "#voteField": "upvotes" },
  expressionValues: { ":plusOne": { N: 1 } },
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `4bab2c16fe96a51a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";
export function request(ctx) {
  return {
operation: "DeleteItem",
key: util.dynamodb.toMapValues({ id: ctx.args.id }),
  };
}

~~~

| | |
| -- | -- |
| Hash | `6f631e2f7615de93` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { owner } = ctx.args;
  return {
operation: "Query",
query: {
  expression: "ownerId = :ownerId",
  expressionValues: util.dynamodb.toMapValues({ ":ownerId": owner }),
},
index: "owner-index",
  };
}

~~~

| | |
| -- | -- |
| Hash | `aa9fb179a14c1f5a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
export function request(ctx) {
  return { operation: "Scan" };
}

~~~

| | |
| -- | -- |
| Hash | `e2c67cc113847600` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
export function request(ctx) {
  const { nextToken, lastSync } = ctx.args;
  return { operation: "Sync", limit: 100, nextToken, lastSync };
}

~~~

| | |
| -- | -- |
| Hash | `87f694f7341ed37b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId } = ctx.args;
  return {
operation: "BatchGetItem",
tables: {
  authors: [util.dynamodb.toMapValues({ authorId })],
  posts: [util.dynamodb.toMapValues({ authorId, postId })],
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `332fbbbfedb89bba` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId } = ctx.args;
  return {
operation: "BatchDeleteItem",
tables: {
  authors: [util.dynamodb.toMapValues({ authorId })],
  posts: [util.dynamodb.toMapValues({ authorId, postId })],
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `f0a5a683fa5c31f7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId, name, title } = ctx.args;
  return {
operation: "BatchPutItem",
tables: {
  authors: [util.dynamodb.toMapValues({ authorId, name })],
  posts: [util.dynamodb.toMapValues({ authorId, postId, title })],
},
  };
}

~~~

| | |
| -- | -- |
| Hash | `5b35643d0deead1d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId } = ctx.args;
  return {
operation: "TransactGetItems",
transactItems: [
  {
    table: "posts",
    key: util.dynamodb.toMapValues({ postId }),
  },
  {
    table: "authors",
    key: util.dynamodb.toMapValues({ authorId }),
  },
],
  };
}

~~~

| | |
| -- | -- |
| Hash | `5d3066384580c8a5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-external-ddb-table/)

##### `Unnamed Snippet`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  const { authorId, postId, title, description, oldTitle, authorName } =
ctx.args;
  return {
operation: "TransactWriteItems",
transactItems: [
  {
    table: "posts",
    operation: "PutItem",
    key: util.dynamodb.toMapValues({ postId }),
    attributeValues: util.dynamodb.toMapValues({ title, description }),
    condition: util.transform.toDynamoDBConditionExpression({
title: { eq: oldTitle },
    }),
  },
  {
    table: "authors",
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({ authorId }),
    update: {
expression: "SET authorName = :name",
expressionValues: util.dynamodb.toMapValues({ ":name": authorName }),
    },
  },
],
  };
}

~~~

| | |
| -- | -- |
| Hash | `f27b22d02f00052c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/)

##### `Terminal`

~~~
npm add @aws-sdk/client-translate

~~~

| | |
| -- | -- |
| Hash | `866e7a4da60b689f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
  data,
});

const dataStack = Stack.of(backend.data);

const translateDataSource = backend.data.addHttpDataSource(
  "TranslateDataSource",
  `https://translate.${dataStack.region}.amazonaws.com`,
  {
authorizationConfig: {
  signingRegion: dataStack.region,
  signingServiceName: "translate",
},
  },
);

translateDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
actions: ["translate:TranslateText"],
resources: ["*"],
  }),
);

~~~

| | |
| -- | -- |
| Hash | `c413a6f4bbb777ac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/)

##### `amplify/data/translate.js`

~~~
export function request(ctx) {
  return {
method: "POST",
resourcePath: "/",
params: {
  body: {
    SourceLanguageCode: ctx.arguments.sourceLanguage,
    TargetLanguageCode: ctx.arguments.targetLanguage,
    Text: ctx.arguments.text,
  },
  headers: {
    "Content-Type": "application/x-amz-json-1.1",
    "X-Amz-Target": "AWSShineFrontendService_20170701.TranslateText",
  },
},
  };
}

export function response(ctx) {
  return JSON.parse(ctx.result.body).TranslatedText;
}

~~~

| | |
| -- | -- |
| Hash | `c824b7f789a5b258` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  translate: a
.query()
.arguments({
  sourceLanguage: a.string().required(),
  targetLanguage: a.string().required(),
  text: a.string().required(),
})
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "TranslateDataSource",
    entry: "./translate.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `40af1d5454d7a4a4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/)

##### `main.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `main.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `main.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `src/main.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `898189587ea17dac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-translate/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const { data } = await client.queries.translate({
  sourceLanguage: "en",
  targetLanguage: "es",
  text: "Hello World!",
});

~~~

| | |
| -- | -- |
| Hash | `81e213bec681832b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `Terminal`

~~~
npm add @aws-sdk/client-rekognition

~~~

| | |
| -- | -- |
| Hash | `db746639848e0a89` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "predictions_gen2",
});

~~~

| | |
| -- | -- |
| Hash | `a043adb860e7a842` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "predictions_gen2",
});

~~~

| | |
| -- | -- |
| Hash | `a043adb860e7a842` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
});

const dataStack = Stack.of(backend.data);

// Set environment variables for the S3 Bucket name
backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  S3_BUCKET_NAME: backend.storage.resources.bucket.bucketName,
};

const rekognitionDataSource = backend.data.addHttpDataSource(
  "RekognitionDataSource",
  `https://rekognition.${dataStack.region}.amazonaws.com`,
  {
authorizationConfig: {
  signingRegion: dataStack.region,
  signingServiceName: "rekognition",
},
  },
);

rekognitionDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
actions: ["rekognition:DetectText", "rekognition:DetectLabels"],
resources: ["*"],
  }),
);

backend.storage.resources.bucket.grantReadWrite(
  rekognitionDataSource.grantPrincipal,
);

~~~

| | |
| -- | -- |
| Hash | `dd7bcc3731acb6d0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `amplify/data/identifyText.ts`

~~~
export function request(ctx) {
  return {
method: "POST",
resourcePath: "/",
params: {
  body: {
    Image: {
S3Object: {
  Bucket: ctx.env.S3_BUCKET_NAME,
  Name: ctx.arguments.path,
},
    },
  },
  headers: {
    "Content-Type": "application/x-amz-json-1.1",
    "X-Amz-Target": "RekognitionService.DetectText",
  },
},
  };
}

export function response(ctx) {
  return JSON.parse(ctx.result.body)
.TextDetections.filter((item) => item.Type === "LINE")
.map((item) => item.DetectedText)
.join("\n")
.trim();
}

~~~

| | |
| -- | -- |
| Hash | `e93e201396687ac8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  identifyText: a
.query()
.arguments({
  path: a.string(),
})
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    entry: "./identifyText.js",
    dataSource: "RekognitionDataSource",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `b81c707fc1695eb1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "predictions_gen2",
  access: (allow) => ({
"public/*": [allow.guest.to(["list", "write", "get"])],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `85d2795e6ccb1296` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-rekognition/)

##### `App.tsx`

~~~
import { type ChangeEvent, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { uploadData } from "aws-amplify/storage";
import { Schema } from "@/amplify/data/resource";
import "./App.css";

// Generating the client
const client = generateClient<Schema>();

type IdentifyTextReturnType = Schema["identifyText"]["returnType"];

function App() {
  // State to hold the recognized text
  const [path, setPath] = useState<string>("");
  const [textData, setTextData] = useState<IdentifyTextReturnType>();

  // Function to handle file upload to S3 bucket
  const handleTranslate = async (event: ChangeEvent<HTMLInputElement>) => {
if (event.target.files) {
  const file = event.target.files[0];

  const s3Path = "public/" + file.name;

  try {
    uploadData({
path: s3Path,
data: file,
    });

    setPath(s3Path);
  } catch (error) {
    console.error(error);
  }
}
  };

  // Function to recognize text from the uploaded image
  const recognizeText = async () => {
// Identifying text in the uploaded image
const { data } = await client.queries.identifyText({
  path, // File name
});
setTextData(data);
  };

  return (
<div>
  <h1>Amazon Rekognition Text Recognition</h1>
  <div>
    <input type="file" onChange={handleTranslate} />
    <button onClick={recognizeText}>Recognize Text</button>
    <div>
<h3>Recognized Text:</h3>
{textData}
    </div>
  </div>
</div>
  );
}

export default App;

~~~

| | |
| -- | -- |
| Hash | `cae12f526b62efc6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, MODEL_ID, generateHaikuFunction } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
  generateHaikuFunction,
});

backend.generateHaikuFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
effect: Effect.ALLOW,
actions: ["bedrock:InvokeModel"],
resources: [`arn:aws:bedrock:*::foundation-model/${MODEL_ID}`],
  }),
);

~~~

| | |
| -- | -- |
| Hash | `1008539ad82da723` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib";

export const backend = defineBackend({
  auth,
  data,
});

const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

const bedrockDataSource = backend.data.addHttpDataSource(
  "BedrockDataSource",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
authorizationConfig: {
  signingRegion: Stack.of(backend.data).region,
  signingServiceName: "bedrock",
},
  },
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
effect: Effect.ALLOW,
actions: ["bedrock:InvokeModel"],
resources: [
  `arn:aws:bedrock:${Stack.of(backend.data).region}::foundation-model/${MODEL_ID}`,
],
  }),
);

backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
  MODEL_ID,
};

~~~

| | |
| -- | -- |
| Hash | `6f99fa643c27dcea` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0";

export const generateHaikuFunction = defineFunction({
  entry: "./generateHaiku.ts",
  environment: {
MODEL_ID,
  },
});

const schema = a.schema({
  generateHaiku: a
.query()
.arguments({ prompt: a.string().required() })
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(a.handler.function(generateHaikuFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `b9d1d222318eb979` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  generateHaiku: a
.query()
.arguments({ prompt: a.string().required() })
.returns(a.string())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "BedrockDataSource",
    entry: "./generateHaiku.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `f0d45d7747bca578` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `amplify/data/generateHaiku.ts`

~~~
import type { Schema } from "./resource";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

// initialize bedrock runtime client
const client = new BedrockRuntimeClient();

export const handler: Schema["generateHaiku"]["functionHandler"] = async (
  event,
  context,
) => {
  // User prompt
  const prompt = event.arguments.prompt;

  // Invoke model
  const input = {
modelId: process.env.MODEL_ID,
contentType: "application/json",
accept: "application/json",
body: JSON.stringify({
  anthropic_version: "bedrock-2023-05-31",
  system:
    "You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.",
  messages: [
    {
role: "user",
content: [
  {
    type: "text",
    text: prompt,
  },
],
    },
  ],
  max_tokens: 1000,
  temperature: 0.5,
}),
  } as InvokeModelCommandInput;

  const command = new InvokeModelCommand(input);

  const response = await client.send(command);

  // Parse the response and return the generated haiku
  const data = JSON.parse(Buffer.from(response.body).toString());

  return data.content[0].text;
};

~~~

| | |
| -- | -- |
| Hash | `e600f7456a31a935` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `amplify/data/generateHaiku.js`

~~~
export function request(ctx) {
  // Define a system prompt to give the model a persona
  const system =
"You are a an expert at crafting a haiku. You are able to craft a haiku out of anything and therefore answer only in haiku.";

  const prompt = ctx.args.prompt;

  // Construct the HTTP request to invoke the generative AI model
  return {
resourcePath: `/model/${ctx.env.MODEL_ID}/invoke`,
method: "POST",
params: {
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    anthropic_version: "bedrock-2023-05-31",
    system,
    messages: [
{
  role: "user",
  content: [
    {
      type: "text",
      text: prompt,
    },
  ],
},
    ],
    max_tokens: 1000,
    temperature: 0.5,
  },
},
  };
}

// Parse the response and return the generated haiku
export function response(ctx) {
  const res = JSON.parse(ctx.result.body);
  const haiku = res.content[0].text;

  return haiku;
}

~~~

| | |
| -- | -- |
| Hash | `cbe2dc17aef258b0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `App.tsx`

~~~
const { data, errors } = await client.queries.generateHaiku({
  prompt: "Frank Herbert's Dune",
});

~~~

| | |
| -- | -- |
| Hash | `52d66c7ca199349d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-bedrock/)

##### `App.tsx`

~~~
import { FormEvent, useState } from "react";

import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);

  const sendPrompt = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault();

const { data, errors } = await client.queries.generateHaiku({
  prompt,
});

if (!errors) {
  setAnswer(data);
  setPrompt("");
} else {
  console.log(errors);
}
  };

  return (
<main className="flex min-h-screen flex-col items-center justify-center p-24 dark:text-white">
  <div>
    <h1 className="text-3xl font-bold text-center mb-4">Haiku Generator</h1>

    <form className="mb-4 self-center max-w-[500px]" onSubmit={sendPrompt}>
<input
  className="text-black p-2 w-full"
  placeholder="Enter a prompt..."
  name="prompt"
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
/>
    </form>

    <div className="text-center">
<pre>{answer}</pre>
    </div>
  </div>
</main>
  );
}

~~~

| | |
| -- | -- |
| Hash | `c90ccefcb690e15b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `d4a9edbd787c42a9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

const httpDataSource = backend.data.addHttpDataSource(
  "HttpDataSource",
  "https://www.example.com",
);

~~~

| | |
| -- | -- |
| Hash | `61d95d9d8b84721a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  addPost: a
.mutation()
.arguments({
  title: a.string(),
  content: a.string(),
  author: a.string().required(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
    entry: "./addPost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `51f55c11c111f5f6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  getPost: a
.query()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
    entry: "./getPost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `69971cfbd80f236f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  updatePost: a
.mutation()
.arguments({
  id: a.id().required(),
  title: a.string(),
  content: a.string(),
  author: a.string(),
})
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
    entry: "./updatePost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `ac60f58446239a86` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a.customType({
title: a.string(),
content: a.string(),
author: a.string().required(),
  }),
  deletePost: a
.mutation()
.arguments({ id: a.id().required() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "HttpDataSource",
    entry: "./deletePost.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `14260040162c808a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/addPost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "POST",
resourcePath: "/post",
params: {
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    title: ctx.arguments.title,
    content: ctx.arguments.content,
    author: ctx.arguments.author,
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `3f15393d6b74ef97` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/getPost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "GET",
resourcePath: "/posts/" + ctx.arguments.id,
params: {
  headers: {
    "Content-Type": "application/json",
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `70f5446fe7fb2a8b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/updatePost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "POST",
resourcePath: "/posts/" + ctx.arguments.id,
params: {
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    title: ctx.arguments.title,
    content: ctx.arguments.content,
    author: ctx.arguments.author,
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `047316efba4e5444` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `amplify/data/deletePost.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
method: "DELETE",
resourcePath: "/posts/" + ctx.arguments.id,
params: {
  headers: {
    "Content-Type": "application/json",
  },
},
  };
}

export function response(ctx) {
  if (ctx.error) {
return util.error(ctx.error.message, ctx.error.type);
  }
  if (ctx.result.statusCode == 200) {
return JSON.parse(ctx.result.body).data;
  } else {
return util.appendError(ctx.result.body, "ctx.result.statusCode");
  }
}

~~~

| | |
| -- | -- |
| Hash | `a3d8554efda4da61` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-http-datasource/)

##### `App.tsx`

~~~
const { data, errors } = await client.mutations.updatePost({
  id: "<post-id>",
  title: "An Updated Post",
});

~~~

| | |
| -- | -- |
| Hash | `dcf98fc5c5e0514b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `Terminal`

~~~
npm add @aws-sdk/client-polly

~~~

| | |
| -- | -- |
| Hash | `cbe3464e3ab1b8d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data, convertTextToSpeech } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { storage } from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  storage,
  convertTextToSpeech,
});

backend.convertTextToSpeech.resources.lambda.addToRolePolicy(
  new PolicyStatement({
actions: ["polly:StartSpeechSynthesisTask"],
resources: ["*"],
  }),
);

~~~

| | |
| -- | -- |
| Hash | `059b08381cc3873c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `amplify/data/convertTextToSpeech.ts`

~~~
import { Schema } from "./resource";
import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
} from "@aws-sdk/client-polly";
import { env } from "$amplify/env/convertTextToSpeech";

export const handler: Schema["convertTextToSpeech"]["functionHandler"] = async (
  event,
) => {
  const client = new PollyClient();
  const task = new StartSpeechSynthesisTaskCommand({
OutputFormat: "mp3",
SampleRate: "8000",
Text: event.arguments.text,
TextType: "text",
VoiceId: "Amy",
OutputS3BucketName: env.PREDICTIONS_GEN_2_BUCKET_NAME,
OutputS3KeyPrefix: "public/",
  });
  const result = await client.send(task);

  return (
result.SynthesisTask?.OutputUri?.replace(
  "https://s3.us-east-1.amazonaws.com/" +
    env.PREDICTIONS_GEN_2_BUCKET_NAME +
    "/public/",
  "",
) ?? ""
  );
};

~~~

| | |
| -- | -- |
| Hash | `b46626c46832e9ff` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const convertTextToSpeech = defineFunction({
  entry: "./convertTextToSpeech.ts",
});

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
  convertTextToSpeech: a
.mutation()
.arguments({
  text: a.string().required(),
})
.returns(a.string().required())
.authorization((allow) => [allow.publicApiKey()])
.handler(a.handler.function(convertTextToSpeech)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
// API Key is used for allow.publicApiKey() rules
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `5b8929bd948f9263` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";
import { convertTextToSpeech } from "../data/resource";

export const storage = defineStorage({
  name: "predictions_gen2",
  access: (allow) => ({
"public/*": [
  allow.resource(convertTextToSpeech).to(["write"]),
  allow.guest.to(["read", "write"]),
],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `8afad9fd1d529ce1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-amazon-polly/)

##### `App.tsx`

~~~
import "./App.css";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { useState } from "react";

const client = generateClient<Schema>();

type PollyReturnType = Schema["convertTextToSpeech"]["returnType"];

function App() {
  const [src, setSrc] = useState("");
  const [file, setFile] = useState<PollyReturnType>("");
  return (
<div className="flex flex-col">
  <button
    onClick={async () => {
const { data, errors } = await client.mutations.convertTextToSpeech({
  text: "Hello World!",
});

if (!errors && data) {
  setFile(data);
} else {
  console.log(errors);
}
    }}
  >
    Synth
  </button>
  <button
    onClick={async () => {
const res = await getUrl({
  path: "public/" + file,
});

setSrc(res.url.toString());
    }}
  >
    Fetch audio
  </button>
  <a href={src}>Get audio file</a>
</div>
  );
}

export default App;

~~~

| | |
| -- | -- |
| Hash | `9469ad173d3b73ca` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
  OrderStatus: a.enum(["OrderPending", "OrderShipped", "OrderDelivered"]),
  OrderStatusChange: a.customType({
orderId: a.id().required(),
status: a.ref("OrderStatus").required(),
message: a.string().required(),
  }),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `63f7e87bfcda28ee` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { aws_events } from "aws-cdk-lib";
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";

export const backend = defineBackend({
  auth,
  data,
});

// Create a new stack for the EventBridge data source
const eventStack = backend.createStack("MyExternalDataSources");

// Reference or create an EventBridge EventBus
const eventBus = aws_events.EventBus.fromEventBusName(
  eventStack,
  "MyEventBus",
  "default",
);

// Add the EventBridge data source
backend.data.addEventBridgeDataSource("MyEventBridgeDataSource", eventBus);

// Create a policy statement to allow invoking the AppSync API's mutations
const policyStatement = new PolicyStatement({
  effect: Effect.ALLOW,
  actions: ["appsync:GraphQL"],
  resources: [`${backend.data.resources.graphqlApi.arn}/types/Mutation/*`],
});

// Create a role for the EventBus to assume
const eventBusRole = new Role(eventStack, "AppSyncInvokeRole", {
  assumedBy: new ServicePrincipal("events.amazonaws.com"),
  inlinePolicies: {
PolicyStatement: new PolicyDocument({
  statements: [policyStatement],
}),
  },
});

// Create an EventBridge rule to route events to the AppSync API
const rule = new aws_events.CfnRule(eventStack, "MyOrderRule", {
  eventBusName: eventBus.eventBusName,
  name: "broadcastOrderStatusChange",
  eventPattern: {
source: ["amplify.orders"],
/* The shape of the event pattern must match EventBridge's event message structure.
So, this field must be spelled as "detail-type". Otherwise, events will not trigger the rule.

https://docs.aws.amazon.com/AmazonS3/latest/userguide/ev-events.html
*/
["detail-type"]: ["OrderStatusChange"],
detail: {
  orderId: [{ exists: true }],
  status: ["PENDING", "SHIPPED", "DELIVERED"],
  message: [{ exists: true }],
},
  },
  targets: [
{
  id: "orderStatusChangeReceiver",
  arn: backend.data.resources.cfnResources.cfnGraphqlApi
    .attrGraphQlEndpointArn,
  roleArn: eventBusRole.roleArn,
  appSyncParameters: {
    graphQlOperation: `
    mutation PublishOrderFromEventBridge(
$orderId: String!
$status: String!
$message: String!
    ) {
publishOrderFromEventBridge(orderId: $orderId, status: $status, message: $message) {
  orderId
  status
  message
}
    }`,
  },
  inputTransformer: {
    inputPathsMap: {
orderId: "$.detail.orderId",
status: "$.detail.status",
message: "$.detail.message",
    },
    inputTemplate: JSON.stringify({
orderId: "<orderId>",
status: "<status>",
message: "<message>",
    }),
  },
},
  ],
});

~~~

| | |
| -- | -- |
| Hash | `e9b07c00017b6864` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // ...
  OrderStatus: a.enum(["OrderPending", "OrderShipped", "OrderDelivered"]),
  OrderStatusChange: a.customType({
orderId: a.id().required(),
status: a.ref("OrderStatus").required(),
message: a.string().required(),
  }),
  publishOrderToEventBridge: a
.mutation()
.arguments({
  orderId: a.id().required(),
  status: a.string().required(),
  message: a.string().required(),
})
.returns(a.ref("OrderStatusChange"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    dataSource: "EventBridgeDataSource",
    entry: "./publishOrderToEventBridge.js",
  }),
),
  publishOrderFromEventBridge: a
.mutation()
.arguments({
  orderId: a.id().required(),
  status: a.string().required(),
  message: a.string().required(),
})
.returns(a.ref("OrderStatusChange"))
.authorization((allow) => [allow.publicApiKey(), allow.guest()])
.handler(
  a.handler.custom({
    entry: "./publishOrderFromEventBridge.js",
  }),
),
  onOrderFromEventBridge: a
.subscription()
.for(a.ref("publishOrderFromEventBridge"))
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    entry: "./onOrderFromEventBridge.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  name: "MyLibrary",
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `8f8869419729e9d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `amplify/data/onOrderStatusChange.js`

~~~
export function request(ctx) {
  return {
payload: {},
  };
}

export function response(ctx) {}

~~~

| | |
| -- | -- |
| Hash | `d28c7ba9ea568301` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `amplify/data/publishOrderToEventBridge.js`

~~~
export function request(ctx) {
  return {
operation: "PutEvents",
events: [
  {
    source: "amplify.orders",
    ["detail-type"]: "OrderStatusChange",
    detail: { ...ctx.args },
  },
],
  };
}

export function response(ctx) {
  return ctx.args;
}

~~~

| | |
| -- | -- |
| Hash | `bee1d61c5fc55b23` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `amplify/data/publishOrderFromEventBridge.js`

~~~
export function request(ctx) {
  return {
payload: ctx.arguments,
  };
}

export function response(ctx) {
  return ctx.arguments;
}

~~~

| | |
| -- | -- |
| Hash | `c52b82246c57ac1f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `App.tsx`

~~~
await client.mutations.publishOrderToEventBridge({
  orderId: "12345",
  status: "SHIPPED",
  message: "Order has been shipped",
});

~~~

| | |
| -- | -- |
| Hash | `7b0f27cf36fd005c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/connect-eventbridge-datasource/)

##### `App.tsx`

~~~
// Subscribe to the mutations triggered by the EventBridge rule
const sub = client.subscriptions.onOrderStatusChange().subscribe({
  next: (data) => {
console.log(data);
  },
});

//...

// Clean up subscription
sub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `3c38c8153f1bba58` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  done: a.boolean(),
  priority: a.enum(["low", "medium", "high"]),
})
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `7232741075ac9a15` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

const backend = defineBackend({
  auth,
  data,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

~~~

| | |
| -- | -- |
| Hash | `bb35bdd46b7971d7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

~~~

| | |
| -- | -- |
| Hash | `8354d1d65db14803` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "opensearch-backup-bucket-amplify-gen-2",
  access: (allow) => ({
"public/*": [allow.guest.to(["list", "write", "get"])],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `8fb723fa5214c0fc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";

import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";

// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});
// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

~~~

| | |
| -- | -- |
| Hash | `4b1b576c9c3ec7c7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";

// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

// Define OpenSearch index mappings
const indexName = "todo";

const indexMapping = {
  settings: {
number_of_shards: 1,
number_of_replicas: 0,
  },
  mappings: {
properties: {
  id: {
    type: "keyword",
  },
  done: {
    type: "boolean",
  },
  content: {
    type: "text",
  },
},
  },
};

~~~

| | |
| -- | -- |
| Hash | `c4a088f13f0aa0c6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";

// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

// Define OpenSearch index mappings
const indexName = "todo";

const indexMapping = {
  settings: {
number_of_shards: 1,
number_of_replicas: 0,
  },
  mappings: {
properties: {
  id: {
    type: "keyword",
  },
  isDone: {
    type: "boolean",
  },
  content: {
    type: "text",
  },
  priority: {
    type: "text",
  },
},
  },
};

// OpenSearch template definition
const openSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
dynamodb:
  acknowledgments: true
  tables:
    - table_arn: "${tableArn}"
stream:
  start_position: "LATEST"
export:
  s3_bucket: "${s3BucketName}"
  s3_region: "${region}"
  s3_prefix: "${tableName}/"
  aws:
    sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
    region: "${region}"
  sink:
- opensearch:
    hosts:
- "https://${openSearchDomain.domainEndpoint}"
    index: "${indexName}"
    index_type: "custom"
    template_content: |
${JSON.stringify(indexMapping)}
    document_id: '\${getMetadata("primary_key")}'
    action: '\${getMetadata("opensearch_action")}'
    document_version: '\${getMetadata("document_version")}'
    document_version_type: "external"
    bulk_size: 4
    aws:
sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
region: "${region}"
`;

~~~

| | |
| -- | -- |
| Hash | `404e714f1ab48643` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Stack } from "aws-cdk-lib";
import { storage } from "./storage/resource";
import * as iam from "aws-cdk-lib/aws-iam";
import * as osis from "aws-cdk-lib/aws-osis";
import * as logs from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";
// Define backend resources
const backend = defineBackend({
  auth,
  data,
  storage,
});

const todoTable =
  backend.data.resources.cfnResources.amplifyDynamoDbTables["Todo"];

// Update table settings
todoTable.pointInTimeRecoveryEnabled = true;

todoTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE,
};

// Get the DynamoDB table ARN
const tableArn = backend.data.resources.tables["Todo"].tableArn;
// Get the DynamoDB table name
const tableName = backend.data.resources.tables["Todo"].tableName;

// Get the data stack
const dataStack = Stack.of(backend.data);

// Create the OpenSearch domain
const openSearchDomain = new opensearch.Domain(dataStack, "OpenSearchDomain", {
  version: opensearch.EngineVersion.OPENSEARCH_2_11,
  nodeToNodeEncryption: true,
  encryptionAtRest: {
enabled: true,
  },
});

// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;

//Get the region
const region = dataStack.region;

// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  dataStack,
  "OpenSearchIntegrationPipelineRole",
  {
assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
inlinePolicies: {
  openSearchPipelinePolicy: new iam.PolicyDocument({
    statements: [
new iam.PolicyStatement({
  actions: ["es:DescribeDomain"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: [
    openSearchDomain.domainArn,
    openSearchDomain.domainArn + "/*",
  ],
  effect: iam.Effect.ALLOW,
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "s3:GetObject",
    "s3:AbortMultipartUpload",
    "s3:PutObject",
    "s3:PutObjectAcl",
  ],
  resources: [s3BucketArn, s3BucketArn + "/*"],
}),
new iam.PolicyStatement({
  effect: iam.Effect.ALLOW,
  actions: [
    "dynamodb:DescribeTable",
    "dynamodb:DescribeContinuousBackups",
    "dynamodb:ExportTableToPointInTime",
    "dynamodb:DescribeExport",
    "dynamodb:DescribeStream",
    "dynamodb:GetRecords",
    "dynamodb:GetShardIterator",
  ],
  resources: [tableArn, tableArn + "/*"],
}),
    ],
  }),
},
managedPolicies: [
  iam.ManagedPolicy.fromAwsManagedPolicyName(
    "AmazonOpenSearchIngestionFullAccess",
  ),
],
  },
);

// Define OpenSearch index mappings
const indexName = "todo";

const indexMapping = {
  settings: {
number_of_shards: 1,
number_of_replicas: 0,
  },
  mappings: {
properties: {
  id: {
    type: "keyword",
  },
  isDone: {
    type: "boolean",
  },
  content: {
    type: "text",
  },
  priority: {
    type: "text",
  },
},
  },
};

// OpenSearch template definition
const openSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
dynamodb:
  acknowledgments: true
  tables:
    - table_arn: "${tableArn}"
stream:
  start_position: "LATEST"
export:
  s3_bucket: "${s3BucketName}"
  s3_region: "${region}"
  s3_prefix: "${tableName}/"
  aws:
    sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
    region: "${region}"
  sink:
- opensearch:
    hosts:
- "https://${openSearchDomain.domainEndpoint}"
    index: "${indexName}"
    index_type: "custom"
    template_content: |
${JSON.stringify(indexMapping)}
    document_id: '\${getMetadata("primary_key")}'
    action: '\${getMetadata("opensearch_action")}'
    document_version: '\${getMetadata("document_version")}'
    document_version_type: "external"
    bulk_size: 4
    aws:
sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
region: "${region}"
`;

// Create a CloudWatch log group
const logGroup = new logs.LogGroup(dataStack, "LogGroup", {
  logGroupName: "/aws/vendedlogs/OpenSearchService/pipelines/1",
  removalPolicy: RemovalPolicy.DESTROY,
});

// Create an OpenSearch Integration Service pipeline
const cfnPipeline = new osis.CfnPipeline(
  dataStack,
  "OpenSearchIntegrationPipeline",
  {
maxUnits: 4,
minUnits: 1,
pipelineConfigurationBody: openSearchTemplate,
pipelineName: "dynamodb-integration-2",
logPublishingOptions: {
  isLoggingEnabled: true,
  cloudWatchLogDestination: {
    logGroup: logGroup.logGroupName,
  },
},
  },
);

~~~

| | |
| -- | -- |
| Hash | `3d16597aaa312cfc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/backend.ts`

~~~
// Add OpenSearch data source
const osDataSource = backend.data.addOpenSearchDataSource(
  "osDataSource",
  openSearchDomain,
);

~~~

| | |
| -- | -- |
| Hash | `73fa3092c82ab57b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/data/searchTodoResolver.js`

~~~
import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */

export function request(ctx) {
  return {
operation: "GET",
path: "/todo/_search",
  };
}

/**
 * Returns the fetched items
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */

export function response(ctx) {
  if (ctx.error) {
util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.hits.hits.map((hit) => hit._source);
}

~~~

| | |
| -- | -- |
| Hash | `687bb0ef861889da` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/search-and-aggregate-queries/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  done: a.boolean(),
  priority: a.enum(["low", "medium", "high"]),
})
.authorization((allow) => [allow.publicApiKey()]),

  searchTodos: a
.query()
.returns(a.ref("Todo").array())
.authorization((allow) => [allow.publicApiKey()])
.handler(
  a.handler.custom({
    entry: "./searchTodoResolver.js",
    dataSource: "osDataSource",
  }),
),
});

~~~

| | |
| -- | -- |
| Hash | `d4394d9ad36ac2df` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/)

##### `amplify/data/resource.ts`

~~~
import {
  a,
  defineData,
  defineFunction,
  type ClientSchema,
} from "@aws-amplify/backend";

const functionWithDataAccess = defineFunction({
  entry: "../functions/data-access.ts",
});

const schema = a
  .schema({
Todo: a.model({
  name: a.string(),
  description: a.string(),
}),
  })
  .authorization((allow) => [allow.resource(functionWithDataAccess)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `06faca1d4de6d812` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/)

##### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Todo: a.model({
  name: a.string(),
  description: a.string(),
}),
  })
  .authorization((allow) => [
allow.resource(functionWithDataAccess).to(["query", "listen"]),
  ]); // allow query and subscription operations but not mutations

~~~

| | |
| -- | -- |
| Hash | `a23fa5edeff73d65` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/)

##### `amplify/functions/data-access.ts`

~~~
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../data/resource';
import { env } from '$amplify/env/<function-name>'; // replace with your function name


Amplify.configure(
  {
API: {
  GraphQL: {
    endpoint: env.<amplifyData>_GRAPHQL_ENDPOINT, // replace with your defineData name
    region: env.AWS_REGION,
    defaultAuthMode: 'identityPool'
  }
}
  },
  {
Auth: {
  credentialsProvider: {
    getCredentialsAndIdentityId: async () => ({
credentials: {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  sessionToken: env.AWS_SESSION_TOKEN,
},
    }),
    clearCredentialsAndIdentityId: () => {
/* noop */
    },
  },
},
  }
);

const dataClient = generateClient<Schema>();

export const handler = async (event) => {
  // your function code goes here
}

~~~

| | |
| -- | -- |
| Hash | `71dbe766650761ef` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/)

##### `Terminal`

~~~
npx ampx generate graphql-client-code --out <path-function-handler-dir>/graphql

~~~

| | |
| -- | -- |
| Hash | `e91221e30934954b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/grant-lambda-function-access-to-api/)

##### `amplify/functions/data-access.ts`

~~~
const client = generateClient<Schema>();

export const handler = async (event) => {
  await client.graphql({
query: createTodo,
variables: {
  input: {
    name: "My first todo",
    description: "This is my first todo",
  },
},
  });

  await client.graphql({
query: listTodos,
  });

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `dbf5abada7203d58` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/)

##### `amplify/data/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/configure-custom-identity-and-group-claim/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  owners: a.string().array(),
})
.authorization((allow) => [allow.ownersDefinedIn("owners")]),
});

~~~

| | |
| -- | -- |
| Hash | `c11708f5a31a500d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// Create a record with current user as first owner
const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `a4e33f3ee41a3d19` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/)

##### `Unnamed Snippet`

~~~
await client.models.Todo.update(
  {
id: newTodo.id,
owners: [...(newTodo.owners as string[]), otherUserId],
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `27d103ec9928e5ee` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/multi-user-data-access/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  authors: a.string().array(), // record owner information now stored in "authors" field
})
.authorization((allow) => [allow.ownersDefinedIn("authors")]),
});

~~~

| | |
| -- | -- |
| Hash | `e980f738c085ac2f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)

##### `amplify/data/resource.ts`

~~~
// The "owner" of a Todo is allowed to create, read, update, and delete their own todos
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `c235455cb03a5496` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)

##### `amplify/data/resource.ts`

~~~
// The "owner" of a Todo record is only allowed to create, read, and update it.
// The "owner" of a Todo record is denied to delete it.
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.owner().to(["create", "read", "update"])]),
});

~~~

| | |
| -- | -- |
| Hash | `4d68a311e1ae39ec` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `b73cd93b7f81ba2a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `b73cd93b7f81ba2a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  owner: a
    .string()
    .authorization((allow) => [allow.owner().to(["read", "delete"])]),
})
.authorization((allow) => [allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `82938d1493598d00` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/per-user-per-owner-data-access/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  author: a.string(), // record owner information now stored in "author" field
})
.authorization((allow) => [allow.ownerDefinedIn("author")]),
});

~~~

| | |
| -- | -- |
| Hash | `f726c21f04df30d2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.authenticated()]),
});

~~~

| | |
| -- | -- |
| Hash | `9b0106fa74c7ae17` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.authenticated("identityPool")]),
});

~~~

| | |
| -- | -- |
| Hash | `b9b26cd28edf59b6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/signed-in-user-data-access/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "identityPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `75bbbc970e89b3dc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "identityPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `75bbbc970e89b3dc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/)

##### `amplify/data/resource.ts`

~~~
// allow one specific group
const schema = a.schema({
  Salary: a
.model({
  wage: a.float(),
  currency: a.string(),
})
.authorization((allow) => [allow.group("Admin")]),
});

~~~

| | |
| -- | -- |
| Hash | `3558bb1b245a4672` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// As a signed-in user that belongs to the 'Admin' User Pool Group
const { errors, data: newSalary } = await client.models.Salary.create(
  {
wage: 50.25,
currency: "USD",
  },
  {
authMode: "userPool",
  },
);

~~~

| | |
| -- | -- |
| Hash | `573fd6a09fd9031f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/)

##### `Unnamed Snippet`

~~~
// allow multiple specific groups
const schema = a.schema({
  Salary: a
.model({
  wage: a.float(),
  currency: a.string(),
})
.authorization((allow) => [allow.groups(["Admin", "Leadership"])]),
});

~~~

| | |
| -- | -- |
| Hash | `17dfb540da28c8b0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/)

##### `Unnamed Snippet`

~~~
// Dynamic group authorization with multiple groups
const schema = a.schema({
  Post: a
.model({
  title: a.string(),
  groups: a.string().array(),
})
.authorization((allow) => [allow.groupsDefinedIn("groups")]),
});

~~~

| | |
| -- | -- |
| Hash | `bf7dbedd18de6bb0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/user-group-based-data-access/)

##### `Unnamed Snippet`

~~~
// Dynamic group authorization with a single group
const schema = a.schema({
  Post: a
.model({
  title: a.string(),
  group: a.string(),
})
.authorization((allow) => [allow.groupDefinedIn("group")]),
});

~~~

| | |
| -- | -- |
| Hash | `d1d464b81fe796a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/using-oidc-authorization-provider/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/using-oidc-authorization-provider/)

##### `amplify/data/resource.ts`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/using-oidc-authorization-provider/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/using-oidc-authorization-provider/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/)

##### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
// STEP 1
// Indicate which models / fields should use a custom authorization rule
.authorization((allow) => [allow.custom()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "lambda",
// STEP 2
// Pass in the function to be used for a custom authorization rule
lambdaAuthorizationMode: {
  function: defineFunction({
    entry: "./custom-authorizer.ts",
  }),
  // (Optional) STEP 3
  // Configure the token's time to live
  timeToLiveInSeconds: 300,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `9cc76371f93ceb4b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "lambda",
  },
);

~~~

| | |
| -- | -- |
| Hash | `f1c468dfd69b0c4a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/)

##### `Unnamed Snippet`

~~~
// amplify/data/custom-authorizer.ts

// This is sample code. Update this to suite your needs
import type { AppSyncAuthorizerHandler } from "aws-lambda"; // types imported from @types/aws-lambda

type ResolverContext = {
  userid: string;
  info: string;
  more_info: string;
};

export const handler: AppSyncAuthorizerHandler<ResolverContext> = async (
  event,
) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
authorizationToken,
requestContext: { apiId, accountId },
  } = event;
  const response = {
isAuthorized: authorizationToken === "custom-authorized",
resolverContext: {
  // eslint-disable-next-line spellcheck/spell-checker
  userid: "user-id",
  info: "contextual information A",
  more_info: "contextual information B",
},
deniedFields: [
  `arn:aws:appsync:${process.env.AWS_REGION}:${accountId}:apis/${apiId}/types/Event/fields/comments`,
  `Mutation.createEvent`,
],
ttlOverride: 300,
  };
  console.log(`RESPONSE: ${JSON.stringify(response, null, 2)}`);
  return response;
};

~~~

| | |
| -- | -- |
| Hash | `7979ac575fb5c105` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/)

##### `Unnamed Snippet`

~~~
{
"authorizationToken": "ExampleAuthToken123123123", # Authorization token specified by client
"requestContext": {
    "apiId": "aaaaaa123123123example123", # AppSync API ID
    "accountId": "111122223333", # AWS Account ID
    "requestId": "f4081827-1111-4444-5555-5cf4695f339f",
    "queryString": "mutation CreateEvent {...}\n\nquery MyQuery {...}\n", # GraphQL query
    "operationName": "MyQuery", # GraphQL operation name
    "variables": {} # any additional variables supplied to the operation
}
}

~~~

| | |
| -- | -- |
| Hash | `bf33ce519615bf57` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/)

##### `Unnamed Snippet`

~~~
{
  // required
  "isAuthorized": true, // if "false" then an UnauthorizedException is raised, access is denied
  "resolverContext": { "banana": "very yellow" }, // JSON object visible as $ctx.identity.resolverContext in VTL resolver templates

  // optional
  "deniedFields": ["TypeName.FieldName"], // Forces the fields to "null" when returned to the client
  "ttlOverride": 10 // The number of seconds that the response should be cached for. Overrides default specified in "amplify update api"
}

~~~

| | |
| -- | -- |
| Hash | `1638c78777796c97` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `21cf216d105e1ece` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
  },
  {
authMode: "apiKey",
  },
);

~~~

| | |
| -- | -- |
| Hash | `c8110784c3c7df69` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
})
.authorization((allow) => [allow.guest()]),
});

~~~

| | |
| -- | -- |
| Hash | `02802ed51338dc5f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/public-data-access/)

##### `src/App.tsx`

~~~
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure({
  ...outputs,
  Auth: {
Cognito: {
  identityPoolId: config.aws_cognito_identity_pool_id,
  userPoolClientId: config.aws_user_pools_web_client_id,
  userPoolId: config.aws_user_pools_id,
  allowGuestAccess: true,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `638c91685ddf6aad` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a
.model({
  content: a.string(),
})
.authorization((allow) => [
  // Allow anyone auth'd with an API key to read everyone's posts.
  allow.publicApiKey().to(["read"]),
  // Allow signed-in user to create, read, update,
  // and delete their __OWN__ posts.
  allow.owner(),
]),
});

~~~

| | |
| -- | -- |
| Hash | `e2f15d81cee3ec1a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
const schema = a
  .schema({
// Because no model-level authorization rule is present
// this model will use the global authorization rule.
Todo: a.model({
  content: a.string(),
}),

// Will use model-level authorization rule
Notes: a
  .model({
    content: a.string(),
    // [Model-level authorization rule]
  })
  .authorization((allow) => [allow.publicApiKey().to(["read"])]),

// [Global authorization rule]
  })
  .authorization((allow) => [allow.publicApiKey()]);

~~~

| | |
| -- | -- |
| Hash | `76ed8e59fffd0aac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a
.model({
  content: a.string(),
  createdBy: a.string(),
  // [Model-level authorization rule]
  // All fields (content, createdBy) will be protected by
  // this authorization rule
})
.authorization((allow) => [
  allow.publicApiKey().to(["read"]),
  allow.owner(),
]),
});

~~~

| | |
| -- | -- |
| Hash | `2194b55334d745ad` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Employee: a
.model({
  name: a.string(),
  email: a.string(),
  // [Field-level authorization rule]
  // This auth rule will be used for the "ssn" field
  // All other fields will use the model-level auth rule
  ssn: a.string().authorization((allow) => [allow.owner()]),
})

// [Model-level authorization rule]
.authorization((allow) => [
  allow.authenticated().to(["read"]),
  allow.owner(),
]),
});

~~~

| | |
| -- | -- |
| Hash | `714da914aa4034ef` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  // ...
  listCustomType: a
.query()
.returns(a.ref("CustomType").array())
.handler(
  a.handler.custom({
    entry: "./handler.js",
  }),
)
.authorization((allow) => [
  // Static auth rules - Supported
  allow.guest(),
  allow.publicApiKey(),
  allow.authenticated(),
  allow.group("Admin"),
  allow.groups(["Teacher", "Student"]),

  // Dynamic auth rules - Not supported
  allow.owner(),
  allow.ownerDefinedIn("owner"),
  allow.ownersDefinedIn("otherOwners"),
  allow.groupDefinedIn("group"),
  allow.groupsDefinedIn("otherGroups"),
]),
});

~~~

| | |
| -- | -- |
| Hash | `5e987afe82e5a1ff` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a
.model({
  title: a.string(),
  content: a.string(),
})
.authorization((allow) => [allow.guest().to(["read"]), allow.owner()]),
});

~~~

| | |
| -- | -- |
| Hash | `d51a9297b3d57373` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/customize-authz/](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// Creating a post is restricted to Cognito User Pools
const { data: newPostResult, errors } = await client.models.Post.create({
  query: queries.createPost,
  variables: { input: { title: "Hello World" } },
  authMode: "userPool",
});

// Listing posts is available to unauthenticated users (verified by Amazon Cognito identity pool's unauthenticated role)
const { data: listPostsResult, errors } = await client.models.Post.list({
  query: queries.listPosts,
  authMode: "identityPool",
});

~~~

| | |
| -- | -- |
| Hash | `ba61062287418137` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  completed: a.boolean(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `93fbc94ef4f108d8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)

##### `Unnamed Snippet`

~~~
const client = generateClient<Schema>();

const todo = await client.models.Todo.create({
  content: "Buy Milk",
  completed: false,
});
console.log(`New Todo created: ${todo.id}`); // New Todo created: 5DB6B4CC-CD41-49F5-9844-57C0AB506B69

~~~

| | |
| -- | -- |
| Hash | `95716a52d6270a63` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a
.model({
  todoId: a.id().required(),
  content: a.string(),
  completed: a.boolean(),
})
.identifier(["todoId"])
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `d619a12c5b9f68b2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)

##### `Unnamed Snippet`

~~~
const client = generateClient<Schema>();

const { data: todo, errors } = await client.models.Todo.create({
  todoId: "MyUniqueTodoId",
  content: "Buy Milk",
  completed: false,
});
console.log(`New Todo created: ${todo.todoId}`); // New Todo created: MyUniqueTodoId

~~~

| | |
| -- | -- |
| Hash | `6ffb6c45060a39f9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  StoreBranch: a
.model({
  geoId: a.id().required(),
  name: a.string().required(),
  country: a.string(),
  state: a.string(),
  city: a.string(),
  zipCode: a.string(),
  streetAddress: a.string(),
})
.identifier(["geoId", "name"])
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `dc84893fe413f132` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/identifiers/)

##### `Unnamed Snippet`

~~~
const client = generateClient<Schema>();

const branch = await client.models.StoreBranch.get({
  geoId: "123",
  name: "Downtown",
}); // All identifier fields are required when retrieving an item

~~~

| | |
| -- | -- |
| Hash | `7a1fb3aa2c192ea3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `amplify/data/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `src/App.tsx`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `amplify/data/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `src/App.tsx`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `amplify/data/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `src/App.tsx`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/secondary-index/)

##### `amplify/data/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/)

##### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a
  .schema({
Customer: a
  .model({
    customerId: a.id().required(),
    // fields can be of various scalar types,
    // such as string, boolean, float, integers etc.
    name: a.string(),
    // fields can be of custom types
    location: a.customType({
// fields can be required or optional
lat: a.float().required(),
long: a.float().required(),
    }),
    // fields can be enums
    engagementStage: a.enum(["PROSPECT", "INTERESTED", "PURCHASED"]),
    collectionId: a.id(),
    collection: a.belongsTo("Collection", "collectionId"),
    // Use custom identifiers. By default, it uses an `id: a.id()` field
  })
  .identifier(["customerId"]),
Collection: a
  .model({
    customers: a.hasMany("Customer", "collectionId"), // setup relationships between types
    tags: a.string().array(), // fields can be arrays
    representativeId: a.id().required(),
    // customize secondary indexes to optimize your query performance
  })
  .secondaryIndexes((index) => [index("representativeId")]),
  })
  .authorization((allow) => [allow.publicApiKey()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `1f807200986a702a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/)

##### `amplify/data/resource.ts`

~~~
import { defineData } from "@aws-amplify/backend";

const schema = /* GraphQL */ `
  type Todo @model @auth(rules: [{ allow: owner }]) {
content: String
isDone: Boolean
  }
`;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `18d9bf46eea33c9b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Message type that's used for this PubSub sample
  Message: a.customType({
content: a.string().required(),
channelName: a.string().required(),
  }),

  // Message publish mutation
  publish: a
.mutation()
.arguments({
  channelName: a.string().required(),
  content: a.string().required(),
})
.returns(a.ref("Message"))
.handler(a.handler.custom({ entry: "./publish.js" }))
.authorization((allow) => [allow.publicApiKey()]),

  // Subscribe to incoming messages
  receive: a
.subscription()
// subscribes to the 'publish' mutation
.for(a.ref("publish"))
// subscription handler to set custom filters
.handler(a.handler.custom({ entry: "./receive.js" }))
// authorization rules as to who can subscribe to the data
.authorization((allow) => [allow.publicApiKey()]),

  // A data model to manage channels
  Channel: a
.model({
  name: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `3f22d1115fdd0bd7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `amplify/data/publish.js`

~~~
// This handler simply passes through the arguments of the mutation through as the result
export function request() {
  return {};
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export function response(ctx) {
  return ctx.args;
}

~~~

| | |
| -- | -- |
| Hash | `a8da17bf52779423` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `amplify/data/receive.js`

~~~
export function request() {
  return {};
}

export const response = (ctx) => {
  return ctx.result;
};

~~~

| | |
| -- | -- |
| Hash | `0c92d3e251c14dd8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const sub = client.subscriptions.receive().subscribe({
  next: (event) => {
console.log(event);
  },
});

~~~

| | |
| -- | -- |
| Hash | `71c0932ed659436e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `Unnamed Snippet`

~~~
client.mutations.publish({
  channelName: "world",
  content: "My first message!",
});

~~~

| | |
| -- | -- |
| Hash | `13b68e9e7816b879` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `Unnamed Snippet`

~~~
sub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `18118a741cc48da5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Channel: a
.model({
  name: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),

  Message: a.customType({
content: a.string().required(),
channelName: a.string().required(),
  }),

  publish: a
.mutation()
.arguments({
  channelName: a.string().required(),
  content: a.string().required(),
})
.returns(a.ref("Message"))
.handler(a.handler.custom({ entry: "./publish.js" }))
.authorization((allow) => [allow.publicApiKey()]),

  receive: a
.subscription()
.for(a.ref("publish"))
.arguments({ namePrefix: a.string() })
.handler(a.handler.custom({ entry: "./receive.js" }))
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `3a761e0e4260590a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/](https://docs.amplify.aws/react/build-a-backend/data/custom-subscription/)

##### `Unnamed Snippet`

~~~
import { util, extensions } from "@aws-appsync/utils";

// Subscription handlers must return a `null` payload on the request
export function request() {
  return { payload: null };
}

/**
 * @param {import('@aws-appsync/utils').Context} ctx
 */
export function response(ctx) {
  const filter = {
channelName: {
  beginsWith: ctx.args.namePrefix,
},
  };

  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));

  return null;
}

~~~

| | |
| -- | -- |
| Hash | `86525827632442c0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/override-resources/](https://docs.amplify.aws/react/build-a-backend/data/override-resources/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/override-resources/](https://docs.amplify.aws/react/build-a-backend/data/override-resources/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/override-resources/](https://docs.amplify.aws/react/build-a-backend/data/override-resources/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/override-resources/](https://docs.amplify.aws/react/build-a-backend/data/override-resources/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/override-resources/](https://docs.amplify.aws/react/build-a-backend/data/override-resources/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/override-resources/](https://docs.amplify.aws/react/build-a-backend/data/override-resources/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/](https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/)

##### `Terminal`

~~~
npm add --save-dev @aws-sdk/client-cognito-identity-provider @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `0a23d15d6d404548` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/](https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/)

##### `amplify/auth/post-confirmation/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  // optionally define an environment variable for your group name
  environment: {
GROUP_NAME: "EVERYONE",
  },
});

~~~

| | |
| -- | -- |
| Hash | `313f2159dfd10f36` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/](https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
  groups: ["EVERYONE"],
  triggers: {
postConfirmation,
  },
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
});

~~~

| | |
| -- | -- |
| Hash | `a33e0d803731568b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/](https://docs.amplify.aws/react/build-a-backend/functions/examples/add-user-to-group/)

##### `amplify/auth/post-confirmation/handler.ts`

~~~
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { env } from "$amplify/env/post-confirmation";

const client = new CognitoIdentityProviderClient();

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const command = new AdminAddUserToGroupCommand({
GroupName: env.GROUP_NAME,
Username: event.userName,
UserPoolId: event.userPoolId,
  });
  const response = await client.send(command);
  console.log("processed", response.$metadata.requestId);
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `c6ed8737a194d963` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)

##### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/)

##### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/](https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/)

##### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/](https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/)

##### `Terminal`

~~~
npm add --save-dev @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `859a0bc7ceb3d153` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
UserProfile: a
  .model({
    email: a.string(),
    profileOwner: a.string(),
  })
  .authorization((allow) => [allow.ownerDefinedIn("profileOwner")]),
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `f2fd0d9df88405a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)

##### `amplify/auth/post-confirmation/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
});

~~~

| | |
| -- | -- |
| Hash | `8b9530b61f2b2da4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)

##### `Terminal`

~~~
npx ampx generate graphql-client-code --out <path-to-post-confirmation-handler-dir>/graphql

~~~

| | |
| -- | -- |
| Hash | `c6c70644fbaf72c0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)

##### `amplify/auth/post-confirmation/handler.ts`

~~~
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { env } from "$amplify/env/post-confirmation";
import { createUserProfile } from "./graphql/mutations";

Amplify.configure(
  {
API: {
  GraphQL: {
    endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
    region: env.AWS_REGION,
    defaultAuthMode: "iam",
  },
},
  },
  {
Auth: {
  credentialsProvider: {
    getCredentialsAndIdentityId: async () => ({
credentials: {
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  sessionToken: env.AWS_SESSION_TOKEN,
},
    }),
    clearCredentialsAndIdentityId: () => {
/* noop */
    },
  },
},
  },
);

const client = generateClient<Schema>({
  authMode: "iam",
});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  await client.graphql({
query: createUserProfile,
variables: {
  input: {
    email: event.request.userAttributes.email,
    profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
  },
},
  });

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `98f9c783075cf76e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/](https://docs.amplify.aws/react/build-a-backend/functions/examples/create-user-profile-record/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
postConfirmation,
  },
});

~~~

| | |
| -- | -- |
| Hash | `0241a55956ce0589` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/)

##### `amplify/auth/custom-message/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const customMessage = defineFunction({
  name: "custom-message",
});

~~~

| | |
| -- | -- |
| Hash | `b9f42270438de5a4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/)

##### `amplify/auth/custom-message/handler.ts`

~~~
import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
const locale = event.request.userAttributes["locale"];
if (locale === "en") {
  event.response.emailMessage = `Your new one-time code is ${event.request.codeParameter}`;
  event.response.emailSubject = "Reset my password";
} else if (locale === "es") {
  event.response.emailMessage = `Tu nuevo código de un solo uso es ${event.request.codeParameter}`;
  event.response.emailSubject = "Restablecer mi contraseña";
}
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `94344039cff6638a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-message/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { customMessage } from "./custom-message/resource";

export const auth = defineAuth({
  // ...
  triggers: {
customMessage,
  },
});

~~~

| | |
| -- | -- |
| Hash | `9475e9c0f178a185` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/create-auth-challenge/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const createAuthChallenge = defineFunction({
  name: "create-auth-challenge",
});

~~~

| | |
| -- | -- |
| Hash | `a3e090a743d04a5f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/create-auth-challenge/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const createAuthChallenge = defineFunction({
  name: "create-auth-challenge",
});

~~~

| | |
| -- | -- |
| Hash | `a3e090a743d04a5f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/create-auth-challenge/handler.ts`

~~~
import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  if (event.request.challengeName === "CUSTOM_CHALLENGE") {
// Generate a random code for the custom challenge
const challengeCode = "123456";

event.response.challengeMetadata = "TOKEN_CHECK";

event.response.publicChallengeParameters = {
  trigger: "true",
  code: challengeCode,
};

event.response.privateChallengeParameters = { trigger: "true" };
event.response.privateChallengeParameters.answer = challengeCode;
  }
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `40aa58cbc423c8e3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/define-auth-challenge/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const defineAuthChallenge = defineFunction({
  name: "define-auth-challenge",
});

~~~

| | |
| -- | -- |
| Hash | `02beb77eace696f3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/define-auth-challenge/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const defineAuthChallenge = defineFunction({
  name: "define-auth-challenge",
});

~~~

| | |
| -- | -- |
| Hash | `02beb77eace696f3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/define-auth-challenge/handler.ts`

~~~
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // Check if this is the first authentication attempt
  if (event.request.session.length === 0) {
// For the first attempt, we start with the custom challenge
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
event.request.session.length === 1 &&
event.request.session[0].challengeName === "CUSTOM_CHALLENGE" &&
event.request.session[0].challengeResult === true
  ) {
// If this is the second attempt (session length 1),
// it was a CUSTOM_CHALLENGE, and the result was successful
event.response.issueTokens = true;
event.response.failAuthentication = false;
  } else {
// If we reach here, it means either:
// 1. The custom challenge failed
// 2. We've gone through more attempts than expected
// In either case, we fail the authentication
event.response.issueTokens = false;
event.response.failAuthentication = true;
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `74b493084dedc9b3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/define-auth-challenge/handler.ts`

~~~
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // First attempt: Start with SRP_A (Secure Remote Password protocol, step A)
  if (event.request.session.length === 0) {
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "SRP_A";
  } else if (
event.request.session.length === 1 &&
event.request.session[0].challengeName === "SRP_A" &&
event.request.session[0].challengeResult === true
  ) {
// Second attempt: SRP_A was successful, move to PASSWORD_VERIFIER
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "PASSWORD_VERIFIER";
  } else if (
event.request.session.length === 2 &&
event.request.session[1].challengeName === "PASSWORD_VERIFIER" &&
event.request.session[1].challengeResult === true
  ) {
// Third attempt: PASSWORD_VERIFIER was successful, move to CUSTOM_CHALLENGE
event.response.issueTokens = false;
event.response.failAuthentication = false;
event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
event.request.session.length === 3 &&
event.request.session[2].challengeName === "CUSTOM_CHALLENGE" &&
event.request.session[2].challengeResult === true
  ) {
// Fourth attempt: CUSTOM_CHALLENGE was successful, authentication complete
event.response.issueTokens = true;
event.response.failAuthentication = false;
  } else {
// If we reach here, it means one of the challenges failed or
// we've gone through more attempts than expected
event.response.issueTokens = false;
event.response.failAuthentication = true;
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `a3dec3c66d5195fd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/verify-auth-challenge-response/resource.ts`

~~~
import { defineFunction, secret } from "@aws-amplify/backend";

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
});

~~~

| | |
| -- | -- |
| Hash | `ce4044d78084f67a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/verify-auth-challenge-response/handler.ts`

~~~
import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event,
) => {
  event.response.answerCorrect = true;
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `3861b7461a8951c5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/react/build-a-backend/functions/examples/custom-auth-flows/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { createAuthChallenge } from "./create-auth-challenge/resource";
import { defineAuthChallenge } from "./define-auth-challenge/resource";
import { verifyAuthChallengeResponse } from "./verify-auth-challenge-response/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
createAuthChallenge,
defineAuthChallenge,
verifyAuthChallengeResponse,
  },
});

~~~

| | |
| -- | -- |
| Hash | `14ad131b8716bb9b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { createAuthChallenge } from "./create-auth-challenge/resource";
import { defineAuthChallenge } from "./define-auth-challenge/resource";
import { verifyAuthChallengeResponse } from "./verify-auth-challenge-response/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
createAuthChallenge,
defineAuthChallenge,
verifyAuthChallengeResponse,
  },
});

~~~

| | |
| -- | -- |
| Hash | `14ad131b8716bb9b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/)

##### `Terminal`

~~~
npm add --save-dev @aws-lambda-powertools/logger @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `e083d0c2dbcc4af0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/)

##### `amplify/functions/dynamoDB-function/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const myDynamoDBFunction = defineFunction({
  name: "dynamoDB-function",
});

~~~

| | |
| -- | -- |
| Hash | `21cd0df008404d02` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/)

##### `amplify/functions/dynamoDB-function/handler.ts`

~~~
import type { DynamoDBStreamHandler } from "aws-lambda";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamodb-stream-handler",
});

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
logger.info(`Processing record: ${record.eventID}`);
logger.info(`Event Type: ${record.eventName}`);

if (record.eventName === "INSERT") {
  // business logic to process new records
  logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
}
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);

  return {
batchItemFailures: [],
  };
};

~~~

| | |
| -- | -- |
| Hash | `9c30e650d7a58bed` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/dynamo-db-stream/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { StartingPosition, EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myDynamoDBFunction } from "./functions/dynamoDB-function/resource";

const backend = defineBackend({
  auth,
  data,
  myDynamoDBFunction,
});

const todoTable = backend.data.resources.tables["Todo"];
const policy = new Policy(
  Stack.of(todoTable),
  "MyDynamoDBFunctionStreamingPolicy",
  {
statements: [
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
"dynamodb:DescribeStream",
"dynamodb:GetRecords",
"dynamodb:GetShardIterator",
"dynamodb:ListStreams",
    ],
    resources: ["*"],
  }),
],
  },
);
backend.myDynamoDBFunction.resources.lambda.role?.attachInlinePolicy(policy);

const mapping = new EventSourceMapping(
  Stack.of(todoTable),
  "MyDynamoDBFunctionTodoEventStreamMapping",
  {
target: backend.myDynamoDBFunction.resources.lambda,
eventSourceArn: todoTable.tableStreamArn,
startingPosition: StartingPosition.LATEST,
  },
);

mapping.node.addDependency(policy);

~~~

| | |
| -- | -- |
| Hash | `c1748580a80e9b2c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/](https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/)

##### `amplify/auth/pre-token-generation/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const preTokenGeneration = defineFunction({
  name: "pre-token-generation",
});

~~~

| | |
| -- | -- |
| Hash | `1aac0bf493e838ce` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/](https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/)

##### `amplify/auth/pre-token-generation/handler.ts`

~~~
import type { PreTokenGenerationTriggerHandler } from "aws-lambda";

export const handler: PreTokenGenerationTriggerHandler = async (event) => {
  event.response = {
claimsOverrideDetails: {
  groupOverrideDetails: {
    // This will add the user to the cognito group "amplify_group_1"
    groupsToOverride: ["amplify_group_1"],
  },
  claimsToAddOrOverride: {
    // This will add the custom claim "amplfy_attribute" to the id token
    amplfy_attribute: "amplify_gen_2",
  },
},
  };
  return event;
};

~~~

| | |
| -- | -- |
| Hash | `a91e9b3ef170f773` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/](https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { preTokenGeneration } from "./pre-token-generation/resource";

export const auth = defineAuth({
  loginWith: {
email: true,
  },
  triggers: {
preTokenGeneration,
  },
});

~~~

| | |
| -- | -- |
| Hash | `19f4c132710a5756` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/](https://docs.amplify.aws/react/build-a-backend/functions/examples/override-token/)

##### `Unnamed Snippet`

~~~
{
  "cognito:groups": [
"amplify_group_1"
  ],
  "email_verified": true,
  "iss": "...",
  "cognito:username": "...",
  "origin_jti": "...",
  "amplfy_attribute": "amplify_gen_2",
  "aud": "...",
}

~~~

| | |
| -- | -- |
| Hash | `602ae7b01aff8352` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/create-auth-challenge/handler.ts`

~~~
import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
  const { request, response } = event;

  if (
// session will contain 3 "steps": SRP, password verification, custom challenge
request.session.length === 2 &&
request.challengeName === "CUSTOM_CHALLENGE"
  ) {
response.publicChallengeParameters = { trigger: "true" };
response.privateChallengeParameters = { answer: "" };
// optionally set challenge metadata
response.challengeMetadata = "CAPTCHA_CHALLENGE";
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `f3ede51911261aeb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/define-auth-challenge/handler.ts`

~~~
import type { DefineAuthChallengeTriggerHandler } from "aws-lambda";

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  const { response } = event;
  const [srp, password, captcha] = event.request.session;

  // deny by default
  response.issueTokens = false;
  response.failAuthentication = true;

  if (srp?.challengeName === "SRP_A") {
response.failAuthentication = false;
response.challengeName = "PASSWORD_VERIFIER";
  }

  if (
password?.challengeName === "PASSWORD_VERIFIER" &&
password.challengeResult === true
  ) {
response.failAuthentication = false;
response.challengeName = "CUSTOM_CHALLENGE";
  }

  if (
captcha?.challengeName === "CUSTOM_CHALLENGE" &&
// check for the challenge metadata set in "create-auth-challenge"
captcha?.challengeMetadata === "CAPTCHA_CHALLENGE" &&
captcha.challengeResult === true
  ) {
response.issueTokens = true;
response.failAuthentication = false;
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `220e3234773e3f60` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `Terminal`

~~~
npx ampx sandbox secret set GOOGLE_RECAPTCHA_SECRET_KEY

~~~

| | |
| -- | -- |
| Hash | `12b6510fc4e3f672` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/verify-auth-challenge-response/resource.ts`

~~~
import { defineFunction, secret } from "@aws-amplify/backend";

export const verifyAuthChallengeResponse = defineFunction({
  name: "verify-auth-challenge-response",
  environment: {
GOOGLE_RECAPTCHA_SECRET_KEY: secret("GOOGLE_RECAPTCHA_SECRET_KEY"),
  },
});

~~~

| | |
| -- | -- |
| Hash | `5f0f8a2ff5b509af` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/](https://docs.amplify.aws/react/build-a-backend/functions/examples/google-recaptcha-challenge/)

##### `amplify/auth/verify-auth-challenge-response/handler.ts`

~~~
import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda";
import { env } from "$amplify/env/verify-auth-challenge-response";

/**
 * Google ReCAPTCHA verification response
 * @see https://developers.google.com/recaptcha/docs/v3#site_verify_response
 */
type GoogleRecaptchaVerifyResponse = {
  // whether this request was a valid reCAPTCHA token for your site
  success: boolean;
  // the score for this request (0.0 - 1.0)
  score: number;
  // the action name for this request (important to verify)
  action: string;
  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
  challenge_ts: string;
  // the hostname of the site where the reCAPTCHA was solved
  hostname: string;
  // optional error codes
  "error-codes"?: unknown[];
};

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
  event,
) => {
  if (!event.request.challengeAnswer) {
throw new Error("Missing challenge answer");
  }

  // https://developers.google.com/recaptcha/docs/verify#api_request
  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  const params = new URLSearchParams({
secret: env.GOOGLE_RECAPTCHA_SECRET_KEY,
response: event.request.challengeAnswer,
  });
  url.search = params.toString();

  const request = new Request(url, {
method: "POST",
  });

  const response = await fetch(request);
  const result = (await response.json()) as GoogleRecaptchaVerifyResponse;

  if (!result.success) {
throw new Error("Verification failed", { cause: result["error-codes"] });
  }

  // indicate whether the answer is correct
  event.response.answerCorrect = result.success;

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `a278e2c6359ca317` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/](https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/)

##### `amplify/auth/pre-sign-up/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  name: "pre-sign-up",
});

~~~

| | |
| -- | -- |
| Hash | `a1c0bf89b3049524` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/](https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/)

##### `amplify/auth/pre-sign-up/handler.ts`

~~~
import type { PreSignUpTriggerHandler } from "aws-lambda";

function isOlderThan(date: Date, age: number) {
  const comparison = new Date();
  comparison.setFullYear(comparison.getFullYear() - age);
  return date.getTime() > comparison.getTime();
}

export const handler: PreSignUpTriggerHandler = async (event) => {
  const birthdate = new Date(event.request.userAttributes["birthdate"]);

  // you must be 13 years or older
  if (!isOlderThan(birthdate, 13)) {
throw new Error("You must be 13 years or older to use this site");
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `70b553df14441114` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/](https://docs.amplify.aws/react/build-a-backend/functions/examples/user-attribute-validation/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { preSignUp } from "./pre-sign-up/resource";

export const auth = defineAuth({
  // ...
  triggers: {
preSignUp,
  },
});

~~~

| | |
| -- | -- |
| Hash | `b723d71fb646496c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/](https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/)

##### `amplify/auth/resource.ts`

~~~
import { defineAuth } from "@aws-amplify/backend";
import { preSignUp } from "./pre-sign-up/resource";

export const auth = defineAuth({
  // ...
  triggers: {
preSignUp,
  },
});

~~~

| | |
| -- | -- |
| Hash | `b723d71fb646496c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/](https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/)

##### `Terminal`

~~~
npm add --save @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `1b374687de452eb3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/](https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/)

##### `amplify/storage/resource.ts`

~~~
import { defineFunction, defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "myProjectFiles",
  triggers: {
onUpload: defineFunction({
  entry: "./on-upload-handler.ts",
}),
  },
});

~~~

| | |
| -- | -- |
| Hash | `a1c51652375ff7aa` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/](https://docs.amplify.aws/react/build-a-backend/functions/examples/s3-upload-confirmation/)

##### `amplify/storage/on-upload-handler.ts`

~~~
import type { S3Handler } from "aws-lambda";

export const handler: S3Handler = async (event) => {
  const objectKeys = event.Records.map((record) => record.s3.object.key);
  console.log(`Upload handler invoked for objects [${objectKeys.join(", ")}]`);
};

~~~

| | |
| -- | -- |
| Hash | `1da9411beef016a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/](https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/)

##### `amplify/auth/pre-sign-up/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  name: "pre-sign-up",
  // optionally define an environment variable for your filter
  environment: {
ALLOW_DOMAIN: "amazon.com",
  },
});

~~~

| | |
| -- | -- |
| Hash | `4df2be1b1be59111` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/](https://docs.amplify.aws/react/build-a-backend/functions/examples/email-domain-filtering/)

##### `amplify/auth/pre-sign-up/handler.ts`

~~~
import type { PreSignUpTriggerHandler } from "aws-lambda";
import { env } from "$amplify/env/pre-sign-up";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes["email"];

  if (!email.endsWith(env.ALLOW_DOMAIN)) {
throw new Error("Invalid email domain");
  }

  return event;
};

~~~

| | |
| -- | -- |
| Hash | `6c5a21475b7e7a44` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/](https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/)

##### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  entry: "./demo-function-handler.ts",
  name: "overrideName", // explicitly set the name to override the default naming behavior
});

~~~

| | |
| -- | -- |
| Hash | `e096b9f54c2de0fb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/](https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/)

##### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  timeoutSeconds: 60, // 1 minute timeout
});

~~~

| | |
| -- | -- |
| Hash | `9ddcadbec076fffb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/](https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/)

##### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  memoryMB: 256, // allocate 256 MB of memory to the function.
});

~~~

| | |
| -- | -- |
| Hash | `f296449660a68062` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/](https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/)

##### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  runtime: 20, // use Node 20
});

~~~

| | |
| -- | -- |
| Hash | `c750380bfe065319` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/](https://docs.amplify.aws/react/build-a-backend/functions/configure-functions/)

##### `amplify/functions/my-demo-function/resource.ts`

~~~
export const myDemoFunction = defineFunction({
  entry: "./path/to/handler.ts", // this path should either be absolute or relative to the current file
});

~~~

| | |
| -- | -- |
| Hash | `968447ad26e96e85` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  environment: {
NAME: "World",
  },
});

~~~

| | |
| -- | -- |
| Hash | `2c96b809a658d6fc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/resource.ts`

~~~
export const sayHello = defineFunction({
  environment: {
NAME: "World",
API_ENDPOINT: process.env.API_ENDPOINT,
  },
});

~~~

| | |
| -- | -- |
| Hash | `fa6a5002ce0303b1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/handler.ts`

~~~
import { env } from "$amplify/env/say-hello"; // the import is '$amplify/env/<function-name>'

export const handler = async (event) => {
  // the env object has intellisense for all environment variables that are available to the function
  return `Hello, ${env.NAME}!`;
};

~~~

| | |
| -- | -- |
| Hash | `d8864be05ad1014e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/tsconfig.json`

~~~
{
  "compilerOptions": {
"paths": {
  "$amplify/*": ["../.amplify/generated/*"]
}
  }
}

~~~

| | |
| -- | -- |
| Hash | `5763fd6929aa55fe` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  name: "say-hello",
  environment: {
NAME: "World",
  },
});

~~~

| | |
| -- | -- |
| Hash | `c2c60dde955a48c4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `Unnamed Snippet`

~~~
.amplify/generated/env/say-hello.ts

~~~

| | |
| -- | -- |
| Hash | `0db8868b6b6b4159` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/handler.ts`

~~~
import { env } from "$amplify/env/say-hello";

export const handler = async (event) => {
  // the env object has intellisense for all environment variables that are available to the function
  return `Hello, ${env.NAME}!`;
};

~~~

| | |
| -- | -- |
| Hash | `2b26fc1940aea483` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction, secret } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  environment: {
NAME: "World",
API_ENDPOINT: process.env.API_ENDPOINT,
API_KEY: secret("MY_API_KEY"), // this assumes you created a secret named "MY_API_KEY"
  },
});

~~~

| | |
| -- | -- |
| Hash | `ca8b3f2fb9c7f8b7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/](https://docs.amplify.aws/react/build-a-backend/functions/environment-variables-and-secrets/)

##### `amplify/functions/say-hello/handler.ts`

~~~
import { env } from "$amplify/env/say-hello";

export const handler = async (event) => {
  const request = new Request(env.API_ENDPOINT, {
headers: {
  // this is the value of secret named "MY_API_KEY"
  Authorization: `Bearer ${env.API_KEY}`,
},
  });
  // ...
  return `Hello, ${env.NAME}!`;
};

~~~

| | |
| -- | -- |
| Hash | `78c76e0bca2d358d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/](https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";
import { generateMonthlyReports } from "../functions/generate-monthly-reports/resource";

export const storage = defineStorage({
  name: "myReports",
  access: (allow) => ({
"reports/*": [
  allow.resource(generateMonthlyReports).to(["read", "write", "delete"]),
],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `0d24121ec15795f1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/](https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/)

##### `amplify/functions/generate-monthly-reports/handler.ts`

~~~
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "$amplify/env/generate-monthly-reports";

const s3Client = new S3Client();

export const handler = async () => {
  const command = new PutObjectCommand({
Bucket: env.MY_REPORTS_BUCKET_NAME,
Key: `reports/${new Date().toISOString()}.csv`,
Body: new Blob([""], { type: "text/csv;charset=utf-8;" }),
  });

  await s3Client.send(command);
};

~~~

| | |
| -- | -- |
| Hash | `99258be1f75a8f39` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/](https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import { weeklyDigest } from "./functions/weekly-digest/resource";

const backend = defineBackend({
  weeklyDigest,
});

const weeklyDigestLambda = backend.weeklyDigest.resources.lambda;

const topicStack = backend.createStack("WeeklyDigest");
const topic = new sns.Topic(topicStack, "Topic", {
  displayName: "digest",
});

const statement = new iam.PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["sns:Publish"],
  resources: [topic.topicArn],
});

weeklyDigestLambda.addToRolePolicy(statement);

~~~

| | |
| -- | -- |
| Hash | `762565227d0cd347` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/](https://docs.amplify.aws/react/build-a-backend/functions/grant-access-to-other-resources/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import * as iam from "aws-cdk-lib/aws-iam";
import * as sns from "aws-cdk-lib/aws-sns";
import { weeklyDigest } from "./functions/weekly-digest/resource";

const backend = defineBackend({
  weeklyDigest,
});

const weeklyDigestLambda = backend.weeklyDigest.resources.lambda;

const topicStack = backend.createStack("WeeklyDigest");
const topic = new sns.Topic(topicStack, "Topic", {
  displayName: "digest",
});

topic.grantPublish(weeklyDigestLambda);

~~~

| | |
| -- | -- |
| Hash | `a3c8effc91ad348c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/weekly-digest/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/weekly-digest/handler.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `Terminal`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/generate-report/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/drink-some-water/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/drink-some-water/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/remind-me/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/](https://docs.amplify.aws/react/build-a-backend/functions/scheduling-functions/)

##### `amplify/jobs/remind-me/resource.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/functions/modify-resources-with-cdk/](https://docs.amplify.aws/react/build-a-backend/functions/modify-resources-with-cdk/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { myFunction } from "./functions/my-function";

const backend = defineBackend({
  myFunction,
});

// CDK constructs can be accessed via
backend.myFunction.resources;

// where the Lambda function can be found on
backend.myFunction.resources.lambda;

~~~

| | |
| -- | -- |
| Hash | `2e3dc17cabd45c14` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/](https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/)

##### `Terminal`

~~~
npx ampx sandbox --stream-function-logs

~~~

| | |
| -- | -- |
| Hash | `33f9097052947ee1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/](https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/)

##### `Terminal`

~~~
npx ampx sandbox --stream-function-logs --logs-filter auth

~~~

| | |
| -- | -- |
| Hash | `14db1ad6078cc1c5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/](https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/)

##### `Terminal`

~~~
> npx ampx sandbox --stream-function-logs --logs-filter auth
...

✨  Total time: 158.44s

[Sandbox] Watching for file changes...
File written: amplify_outputs.json
[auth-pre-sign-up] 3:36:34 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-sign-up] 3:36:34 PM START RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91 Version: $LATEST
[auth-pre-sign-up] 3:36:34 PM END RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91
[auth-pre-sign-up] 3:36:34 PM REPORT RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91	Duration: 4.12 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 173.67 ms
[auth-post-confirmation] 3:38:40 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-confirmation] 3:38:40 PM START RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7 Version: $LATEST
[auth-post-confirmation] 3:38:41 PM 2024-07-19T22:38:41.209Z	fce69b9f-b257-4af8-8a6e-821f84a39ce7	INFO	processed 412f8911-acfa-41c7-9605-fa0c40891ea9
[auth-post-confirmation] 3:38:41 PM END RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7
[auth-post-confirmation] 3:38:41 PM REPORT RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7	Duration: 264.38 ms	Billed Duration: 265 ms	Memory Size: 512 MB	Max Memory Used: 93 MB	Init Duration: 562.19 ms
[auth-pre-authentication] 3:38:41 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-authentication] 3:38:41 PM START RequestId: 9210ca3a-1351-4826-8544-123684765710 Version: $LATEST
[auth-pre-authentication] 3:38:41 PM END RequestId: 9210ca3a-1351-4826-8544-123684765710
[auth-pre-authentication] 3:38:41 PM REPORT RequestId: 9210ca3a-1351-4826-8544-123684765710	Duration: 3.47 ms	Billed Duration: 4 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 180.24 ms
[auth-post-authentication] 3:38:42 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-authentication] 3:38:42 PM START RequestId: 60c1d680-ea24-4a8b-93de-02d085859140 Version: $LATEST
[auth-post-authentication] 3:38:42 PM END RequestId: 60c1d680-ea24-4a8b-93de-02d085859140
[auth-post-authentication] 3:38:42 PM REPORT RequestId: 60c1d680-ea24-4a8b-93de-02d085859140	Duration: 4.61 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 68 MB	Init Duration: 172.66 ms

~~~

| | |
| -- | -- |
| Hash | `ce51bced5be61da3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/](https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/)

##### `Terminal`

~~~
npx ampx sandbox --stream-function-logs --logs-out-file sandbox.log

~~~

| | |
| -- | -- |
| Hash | `db3ab66f8ffdd6e0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/](https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/)

##### `Terminal`

~~~
npx ampx sandbox --stream-function-logs --logs-filter auth --logs-out-file sandbox-auth.log

~~~

| | |
| -- | -- |
| Hash | `c37fd7aefe79328f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/](https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/)

##### `Amplify`

~~~
Build error!
Stack [CDKToolkit] already exists

~~~

| | |
| -- | -- |
| Hash | `f1c032a775d03468` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/](https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/)

##### `AWS`

~~~
cdk bootstrap aws://$(aws sts get-caller-identity --query Account --output text)/$AWS_REGION

~~~

| | |
| -- | -- |
| Hash | `9e5d9cb2a6231fc6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/](https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/)

##### `Terminal`

~~~
npx aws-cdk@latest bootstrap aws://<your-aws-account-id>/<your-aws-region>

~~~

| | |
| -- | -- |
| Hash | `97199b06e17859c9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/pr-previews/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/pr-previews/)

##### `amplify.yml`

~~~
version: 1
backend:
phases:
    build:
  commands:
      - 'npm ci --cache .npm --prefer-offline'
      - 'echo $AWS_BRANCH'
      - |
        case "${AWS_BRANCH}" in
            main)
                echo "Deploying main branch..."
                npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
                ;;
            dev)
                echo "Deploying dev branch..."
                npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
                ;;
            pr-*)
                echo "Deploying pull request branch..."
                npx ampx generate outputs --branch dev --app-id $AWS_APP_ID 
                ;;
            *)
                echo "Deploying to staging branch..."
                npx ampx generate outputs --branch staging --app-id $AWS_APP_ID 
                ;;
        esac
frontend:
phases:
    build:
  commands:
      - 'npm run build'
artifacts:
    baseDirectory: .amplify-hosting
    files:
  - '**/*'
cache:
    paths:
  - .next/cache/**/*
  - .npm/**/*
  - node_modules/**/*

~~~

| | |
| -- | -- |
| Hash | `1c884bd4ed6b07e6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/)

##### `Terminal`

~~~
npx ampx sandbox secret set foo
? Enter secret value: ###
Done!

> npx ampx sandbox secret set bar
? Enter secret value: ###
Done!

~~~

| | |
| -- | -- |
| Hash | `1877f2be69c8f496` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/)

##### `Unnamed Snippet`

~~~
import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
email: true,
externalProviders: {
  facebook: {
    clientId: secret("foo"),
    clientSecret: secret("bar"),
  },
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `57a89d85904e35df` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
import { defineAuth, secret } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
email: true,
externalProviders: {
  facebook: {
    clientId: secret("foo"),
    clientSecret: secret("bar"),
  },
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `57a89d85904e35df` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/)

##### `Terminal`

~~~
npx ampx sandbox secret remove foo

~~~

| | |
| -- | -- |
| Hash | `891a804e7948f947` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox secret remove foo

~~~

| | |
| -- | -- |
| Hash | `891a804e7948f947` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/)

##### `amplify.yml`

~~~
build:
  commands:
- echo "REACT_APP_TEST_VARIABLE=$REACT_APP_TEST_VARIABLE" >> .env
- npm run build

~~~

| | |
| -- | -- |
| Hash | `89f1b18d54b81799` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/)

##### `Unnamed Snippet`

~~~
console.log("REACT_APP_TEST_VARIABLE", process.env.REACT_APP_TEST_VARIABLE);

~~~

| | |
| -- | -- |
| Hash | `a1db81993e18ae6a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/share-resources/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/share-resources/)

##### `amplify.yml`

~~~
version: 1
backend:
phases:
    build:
  commands:
      - 'npm ci --cache .npm --prefer-offline'
      - 'echo $AWS_BRANCH'
      - |
        case "${AWS_BRANCH}" in
            main)
                echo "Deploying main branch..."
                npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
                ;;
            dev)
                echo "Deploying dev branch..."
                npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
                ;;
            pr-*)
                echo "Deploying pull request branch..."
                npx ampx generate outputs --branch previews --app-id $AWS_APP_ID
                ;;
            *)
                echo "Deploying to staging branch..."
                npx ampx generate outputs --branch dev --app-id $AWS_APP_ID
                ;;
        esac
frontend:
phases:
    build:
  commands:
      - 'npm run build'
artifacts:
    baseDirectory: .next
    files:
  - '**/*'
cache:
    paths:
  - .next/cache/**/*
  - .npm/**/*
  - node_modules/**/*

~~~

| | |
| -- | -- |
| Hash | `9aaa4b8e97b82ac0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/)

##### `Unnamed Snippet`

~~~
Actions:
  Build_82:
# Identifies the action. Do not modify this value.
Identifier: aws/build@v1.0.0
# Specifies the source and/or artifacts to pass to the action as input.
Inputs:
  # Optional
  Sources:
    - WorkflowSource # This specifies that the action requires this Workflow as a source
  Variables:
    - Name: BRANCH_NAME
Value: main
    - Name: AMPLIFY_APP_ID
Value: #####
Configuration:
  # Required - Steps are sequential instructions that run shell commands
  Steps:
    - Run: export CI=1
    - Run: npm ci
    - Run: npx ampx pipeline-deploy --branch $BRANCH_NAME --app-id $AMPLIFY_APP_ID

~~~

| | |
| -- | -- |
| Hash | `1c7a464e7f2880f6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/)

##### `Unnamed Snippet`

~~~
Configuration:
  # Required - Steps are sequential instructions that run shell commands
  Steps:
    - Run: export CI=1
    - Run: npm ci
    - Run: npx ampx pipeline-deploy --branch $BRANCH_NAME --app-id $AMPLIFY_APP_ID
    - Run: if [ $BRANCH_NAME = "main" ]; then curl -X POST -d {}
  "https://webhooks.amplify.us-west-2.amazonaws.com/prod/webhooks?id=WEBHOOK-ID&token=TOKEN&operation=startbuild"
  -H "Content-Type:application/json"; fi

~~~

| | |
| -- | -- |
| Hash | `49fa8f67ebb20de3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/cross-account-deployments/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/cross-account-deployments/)

##### `Terminal`

~~~
// This environment variable is required to run the pipeline-deploy command in a non Amplify CI environment
- Run: export CI=1

// Perform a clean install of the dependencies
- Run: npm ci

// Deploy the backend for your Amplify Gen 2 app
- Run: npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID

// Trigger frontend build using incoming webhooks
- Run: if [ $AWS_BRANCH = "main" ]; then curl -X POST -d {} "`webhookUrl`&operation=startbuild" -H "Content-Type:application/json"; fi

~~~

| | |
| -- | -- |
| Hash | `8245f9493b30aad6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/how-amplify-works/concepts/](https://docs.amplify.aws/react/how-amplify-works/concepts/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/how-amplify-works/concepts/](https://docs.amplify.aws/react/how-amplify-works/concepts/)

##### `Unnamed Snippet`

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

#### [https://docs.amplify.aws/react/how-amplify-works/concepts/](https://docs.amplify.aws/react/how-amplify-works/concepts/)

##### `amplify/auth/resource.ts`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/how-amplify-works/concepts/](https://docs.amplify.aws/react/how-amplify-works/concepts/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/how-amplify-works/concepts/](https://docs.amplify.aws/react/how-amplify-works/concepts/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/how-amplify-works/concepts/](https://docs.amplify.aws/react/how-amplify-works/concepts/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/amplify_outputs/](https://docs.amplify.aws/react/reference/amplify_outputs/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

backend.addOutput({
  storage: {
aws_region: "us-east-1",
bucket_name: "my-externally-managed-bucket",
  },
});

~~~

| | |
| -- | -- |
| Hash | `e4c107cd31dcc7b7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/amplify_outputs/](https://docs.amplify.aws/react/reference/amplify_outputs/)

##### `src/index.ts`

~~~
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

~~~

| | |
| -- | -- |
| Hash | `96184488681b162e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/amplify_outputs/](https://docs.amplify.aws/react/reference/amplify_outputs/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

backend.addOutput({
  custom: {
api_id: "restAPIId",
api_endpoint: "https://api.example.com",
api_name: "restApiName",
  },
});

~~~

| | |
| -- | -- |
| Hash | `ecab0f33dfa4d382` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/amplify_outputs/](https://docs.amplify.aws/react/reference/amplify_outputs/)

##### `src/index.ts`

~~~
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);
const currentConfig = Amplify.getConfig();
Amplify.configure({
  ...currentConfig,
  API: {
REST: {
  [outputs.custom.api_name]: {
    endpoint: outputs.custom.api_endpoint,
    region: "us-east-1",
  },
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `e294b9ce19c1ac38` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/amplify_outputs/](https://docs.amplify.aws/react/reference/amplify_outputs/)

##### `Unnamed Snippet`

~~~
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://amplify.aws/2024-02/outputs-schema.json",
  "title": "AWS Amplify Backend Outputs",
  "description": "Config format for Amplify Gen 2 client libraries to communicate with backend services.",
  "type": "object",
  "additionalProperties": false,
  "properties": {
"$schema": {
  "description": "JSON schema",
  "type": "string"
},
"version": {
  "description": "Version of this schema",
  "const": "1"
},
"analytics": {
  "description": "Outputs manually specified by developers for use with frontend library",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "amazon_pinpoint": {
"type": "object",
"additionalProperties": false,
"properties": {
  "aws_region": {
    "description": "AWS Region of Amazon Pinpoint resources",
    "$ref": "#/$defs/aws_region"
  },
  "app_id": {
    "type": "string"
  }
},
"required": [
  "aws_region",
  "app_id"
]
    }
  }
},
"auth": {
  "description": "Outputs generated from defineAuth",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "aws_region": {
"description": "AWS Region of Amazon Cognito resources",
"$ref": "#/$defs/aws_region"
    },
    "user_pool_id": {
"description": "Cognito User Pool ID",
"type": "string"
    },
    "user_pool_client_id": {
"description": "Cognito User Pool Client ID",
"type": "string"
    },
    "identity_pool_id": {
"description": "Cognito Identity Pool ID",
"type": "string"
    },
    "password_policy": {
"description": "Cognito User Pool password policy",
"type": "object",
"additionalProperties": false,
"properties": {
  "min_length": {
    "type": "integer",
    "minimum": 6,
    "maximum": 99
  },
  "require_numbers": {
    "type": "boolean"
  },
  "require_lowercase": {
    "type": "boolean"
  },
  "require_uppercase": {
    "type": "boolean"
  },
  "require_symbols": {
    "type": "boolean"
  }
}
    },
    "oauth": {
"type": "object",
"additionalProperties": false,
"properties": {
  "identity_providers": {
    "description": "Identity providers set on Cognito User Pool",
    "type": "array",
    "items": {
      "type": "string",
      "enum": [
        "GOOGLE",
        "FACEBOOK",
        "LOGIN_WITH_AMAZON",
        "SIGN_IN_WITH_APPLE"
      ]
    },
    "minItems": 0,
    "uniqueItems": true
  },
  "domain": {
    "description": "Domain used for identity providers",
    "type": "string"
  },
  "scopes": {
    "type": "array",
    "items": {
      "type": "string"
    },
    "minItems": 0,
    "uniqueItems": true
  },
  "redirect_sign_in_uri": {
    "description": "URIs used to redirect after signing in using an identity provider",
    "type": "array",
    "items": {
      "type": "string"
    },
    "minItems": 1,
    "uniqueItems": true
  },
  "redirect_sign_out_uri": {
    "description": "URIs used to redirect after signing out",
    "type": "array",
    "items": {
      "type": "string"
    },
    "minItems": 1,
    "uniqueItems": true
  },
  "response_type": {
    "type": "string",
    "enum": [
      "code",
      "token"
    ]
  }
},
"required": [
  "identity_providers",
  "domain",
  "scopes",
  "redirect_sign_in_uri",
  "redirect_sign_out_uri",
  "response_type"
]
    },
    "standard_required_attributes": {
"description": "Cognito User Pool standard attributes required for signup",
"type": "array",
"items": {
  "$ref": "#/$defs/amazon_cognito_standard_attributes"
},
"minItems": 0,
"uniqueItems": true
    },
    "username_attributes": {
"description": "Cognito User Pool username attributes",
"type": "array",
"items": {
  "type": "string",
  "enum": [
    "email",
    "phone_number",
    "username"
  ]
},
"minItems": 1,
"uniqueItems": true
    },
    "user_verification_types": {
"type": "array",
"items": {
  "type": "string",
  "enum": [
    "email",
    "phone_number"
  ]
}
    },
    "unauthenticated_identities_enabled": {
"type": "boolean",
"default": true
    },
    "mfa_configuration": {
"type": "string",
"enum": [
  "NONE",
  "OPTIONAL",
  "REQUIRED"
]
    },
    "mfa_methods": {
"type": "array",
"items": {
  "enum": [
    "SMS",
    "TOTP"
  ]
}
    }
  },
  "required": [
    "aws_region",
    "user_pool_id",
    "user_pool_client_id"
  ]
},
"data": {
  "description": "Outputs generated from defineData",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "aws_region": {
"$ref": "#/$defs/aws_region"
    },
    "url": {
"description": "AppSync endpoint URL",
"type": "string"
    },
    "model_introspection": {
"description": "generated model introspection schema for use with generateClient",
"type": "object"
    },
    "api_key": {
"type": "string"
    },
    "default_authorization_type": {
"$ref": "#/$defs/aws_appsync_authorization_type"
    },
    "authorization_types": {
"type": "array",
"items": {
  "$ref": "#/$defs/aws_appsync_authorization_type"
}
    }
  },
  "required": [
    "aws_region",
    "url",
    "default_authorization_type",
    "authorization_types"
  ]
},
"geo": {
  "description": "Outputs manually specified by developers for use with frontend library",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "aws_region": {
"description": "AWS Region of Amazon Location Service resources",
"$ref": "#/$defs/aws_region"
    },
    "maps": {
"description": "Maps from Amazon Location Service",
"type": "object",
"additionalProperties": false,
"properties": {
  "items": {
    "type": "object",
    "additionalProperties": false,
    "propertyNames": {
      "description": "Amazon Location Service Map name",
      "type": "string"
    },
    "patternProperties": {
      ".*": {
        "$ref": "#/$defs/amazon_location_service_config"
      }
    }
  },
  "default": {
    "type": "string"
  }
},
"required": [
  "items",
  "default"
]
    },
    "search_indices": {
"description": "Location search (search by places, addresses, coordinates)",
"type": "object",
"additionalProperties": false,
"properties": {
  "items": {
    "type": "array",
    "uniqueItems": true,
    "minItems": 1,
    "items": {
      "description": "Actual search name",
      "type": "string"
    }
  },
  "default": {
    "type": "string"
  }
},
"required": [
  "items",
  "default"
]
    },
    "geofence_collections": {
"description": "Geofencing (visualize virtual perimeters)",
"type": "object",
"additionalProperties": false,
"properties": {
  "items": {
    "type": "array",
    "uniqueItems": true,
    "minItems": 1,
    "items": {
      "description": "Geofence name",
      "type": "string"
    }
  },
  "default": {
    "type": "string"
  }
},
"required": [
  "items",
  "default"
]
    }
  },
  "required": [
    "aws_region"
  ]
},
"notifications": {
  "type": "object",
  "description": "Outputs manually specified by developers for use with frontend library",
  "additionalProperties": false,
  "properties": {
    "aws_region": {
"$ref": "#/$defs/aws_region"
    },
    "amazon_pinpoint_app_id": {
"type": "string"
    },
    "channels": {
"type": "array",
"items": {
  "$ref": "#/$defs/amazon_pinpoint_channels"
},
"minItems": 1,
"uniqueItems": true
    }
  },
  "required": [
    "aws_region",
    "amazon_pinpoint_app_id",
    "channels"
  ]
},
"storage": {
  "type": "object",
  "description": "Outputs generated from defineStorage",
  "additionalProperties": false,
  "properties": {
    "aws_region": {
"$ref": "#/$defs/aws_region"
    },
    "bucket_name": {
"type": "string"
    }
  },
  "required": [
    "aws_region",
    "bucket_name"
  ]
},
"custom": {
  "description": "Outputs generated from backend.addOutput({ custom: <config> })",
  "type": "object"
}
  },
  "required": [
"version"
  ],
  "$defs": {
"aws_region": {
  "type": "string"
},
"amazon_cognito_standard_attributes": {
  "description": "Amazon Cognito standard attributes for users -- https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html",
  "type": "string",
  "enum": [
    "address",
    "birthdate",
    "email",
    "family_name",
    "gender",
    "given_name",
    "locale",
    "middle_name",
    "name",
    "nickname",
    "phone_number",
    "picture",
    "preferred_username",
    "profile",
    "sub",
    "updated_at",
    "website",
    "zoneinfo"
  ]
},
"aws_appsync_authorization_type": {
  "description": "List of supported auth types for AWS AppSync",
  "type": "string",
  "enum": [
    "AMAZON_COGNITO_USER_POOLS",
    "API_KEY",
    "AWS_IAM",
    "AWS_LAMBDA",
    "OPENID_CONNECT"
  ]
},
"amazon_location_service_config": {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "style": {
"description": "Map style",
"type": "string"
    }
  }
},
"amazon_pinpoint_channels": {
  "description": "supported channels for Amazon Pinpoint",
  "type": "string",
  "enum": [
    "IN_APP_MESSAGING",
    "FCM",
    "APNS",
    "EMAIL",
    "SMS"
  ]
}
  }
}
~~~

| | |
| -- | -- |
| Hash | `f26dc9ec37d0cfd2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/project-structure/](https://docs.amplify.aws/react/reference/project-structure/)

##### `Unnamed Snippet`

~~~
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `a99febff4c75ee81` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/project-structure/](https://docs.amplify.aws/react/reference/project-structure/)

##### `Unnamed Snippet`

~~~
├── amplify/
│   ├── auth/
│   │   ├── custom-message/
│   │   │   ├── custom-message.tsx
│   │   │   ├── handler.ts
│   │   │   ├── package.json
│   │   │   └── resource.ts
│   │   ├── post-confirmation.ts
│   │   ├── pre-sign-up.ts
│   │   ├── resource.ts
│   │   └── verification-email.tsx
│   ├── data/
│   │   ├── resolvers/
│   │   │   ├── list-featured-posts.ts
│   │   │   └── list-top-10-posts.ts
│   │   ├── resource.ts
│   │   └── schema.ts
│   ├── jobs/
│   │   ├── monthly-report/
│   │   │   ├── handler.ts
│   │   │   └── resource.ts
│   │   ├── process-featured-posts/
│   │   │   ├── handler.py
│   │   │   ├── requirements.txt
│   │   │   └── resource.ts
│   │   └── store-top-10-posts/
│   │       ├── handler.ts
│   │       └── resource.ts
│   ├── storage/
│   │   ├── photos/
│   │   │   ├── resource.ts
│   │   │   └── trigger.ts
│   │   └── reports/
│   │       └── resource.ts
│   ├── backend.ts
│   └── package.json
├── node_modules/
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json

~~~

| | |
| -- | -- |
| Hash | `a64e4b7016bb56e7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/reference/project-structure/](https://docs.amplify.aws/react/reference/project-structure/)

##### `amplify/backend.ts`

~~~
import * as s3 from "aws-cdk-lib/aws-s3";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

// create the bucket and its stack
const bucketStack = backend.getStack("BucketStack");
const bucket = new s3.Bucket(bucketStack, "Bucket", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

// allow any authenticated user to read and write to the bucket
const authRole = backend.auth.resources.authenticatedUserIamRole;
bucket.grantReadWrite(authRole);

// allow any guest (unauthenticated) user to read from the bucket
const unauthRole = backend.auth.resources.unauthenticatedUserIamRole;
bucket.grantRead(unauthRole);

~~~

| | |
| -- | -- |
| Hash | `b4b49e5b03a1c68e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/)

##### `nuxt-amplify-gen2/plugins/01.amplify-apis.client.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/)

##### `nuxt-amplify-gen2/plugins/01.amplify-apis.server.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/)

##### `nuxt-amplify-gen2/app.vue`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/)

##### `nuxt-amplify-gen2/server/utils/amplifyUtils.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/](https://docs.amplify.aws/react/build-a-backend/data/connect-from-server-runtime/nuxtjs-server-runtime/)

##### `nuxt-amplify-gen2/server/api/current-user.ts`

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

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // 1. Define your return type as a custom type
  EchoResponse: a.customType({
content: a.string(),
executionDuration: a.float(),
  }),

  // 2. Define your query with the return type and, optionally, arguments
  echo: a
.query()
// arguments that this query accepts
.arguments({
  content: a.string(),
})
// return type of the query
.returns(a.ref("EchoResponse"))
// only allow signed-in users to call this API
.authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `d9c0f0f657dbbe8a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `Unnamed Snippet`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // 1. Define your return type as a custom type or model
  Post: a.model({
id: a.id(),
content: a.string(),
likes: a.integer(),
  }),

  // 2. Define your mutation with the return type and, optionally, arguments
  likePost: a
.mutation()
// arguments that this query accepts
.arguments({
  postId: a.string(),
})
// return type of the query
.returns(a.ref("Post"))
// only allow signed-in users to call this API
.authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});

~~~

| | |
| -- | -- |
| Hash | `e394d9c98b1a1f8d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/data/echo-handler/handler.ts`

~~~
import type { Schema } from "../resource";

export const handler: Schema["echo"]["functionHandler"] = async (
  event,
  context,
) => {
  const start = performance.now();
  return {
content: `Echoing content: ${event.arguments.content}`,
executionDuration: performance.now() - start,
  };
};

~~~

| | |
| -- | -- |
| Hash | `584adc09feb4d383` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/data/resource.ts`

~~~
import {
  type ClientSchema,
  a,
  defineData,
  defineFunction, // 1.Import "defineFunction" to create new functions
} from "@aws-amplify/backend";

// 2. define a function
const echoHandler = defineFunction({
  entry: "./echo-handler/handler.ts",
});

const schema = a.schema({
  EchoResponse: a.customType({
content: a.string(),
executionDuration: a.float(),
  }),

  echo: a
.query()
.arguments({ content: a.string() })
.returns(a.ref("EchoResponse"))
.authorization((allow) => [allow.publicApiKey()])
// 3. set the function has the handler
.handler(a.handler.function(echoHandler)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `20ac9f34c6a87da3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
.model({
  content: a.string(),
  likes: a
    .integer()
    .authorization((allow) => [allow.authenticated().to(["read"])]),
})
.authorization((allow) => [
  allow.owner(),
  allow.authenticated().to(["read"]),
]),

  likePost: a
.mutation()
.arguments({ postId: a.id() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.authenticated()])
.handler(
  a.handler.custom({
    dataSource: a.ref("Post"),
    entry: "./increment-like.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `2d2c115e89269264` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/data/increment-like.js`

~~~
import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
operation: "UpdateItem",
key: util.dynamodb.toMapValues({ id: ctx.args.postId }),
update: {
  expression: "ADD likes :plusOne",
  expressionValues: { ":plusOne": { N: 1 } },
},
  };
}

export function response(ctx) {
  return ctx.result;
}

~~~

| | |
| -- | -- |
| Hash | `b8bef9853eb46bd0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/backend.ts`

~~~
import * as dynamoDb from "aws-cdk-lib/aws-dynamodb";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

export const backend = defineBackend({
  auth,
  data,
});

const externalDataSourcesStack = backend.createStack("MyExternalDataSources");

const externalTable = dynamoDb.Table.fromTableName(
  externalDataSourcesStack,
  "MyTable",
  "MyExternalTable",
);

backend.data.addDynamoDbDataSource("ExternalTableDataSource", externalTable);

~~~

| | |
| -- | -- |
| Hash | `fedff4bb36109427` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
.model({
  content: a.string(),
  likes: a
    .integer()
    .authorization((allow) => [allow.authenticated().to(["read"])]),
})
.authorization((allow) => [
  allow.owner(),
  allow.authenticated().to(["read"]),
]),

  likePost: a
.mutation()
.arguments({ postId: a.id() })
.returns(a.ref("Post"))
.authorization((allow) => [allow.authenticated()])
.handler(
  a.handler.custom({
    dataSource: "ExternalTableDataSource",
    entry: "./increment-like.js",
  }),
),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `37dddc093610e7b1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `Unnamed Snippet`

~~~
const { data, errors } = await client.queries.echo({
  content: "hello world!!!",
});

~~~

| | |
| -- | -- |
| Hash | `ffefd700b1e323c9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `Unnamed Snippet`

~~~
const { data, errors } = await client.mutations.likePost({
  postId: "hello",
});

~~~

| | |
| -- | -- |
| Hash | `cb7710cc0dc02bd3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/](https://docs.amplify.aws/react/build-a-backend/data/custom-business-logic/)

##### `amplify/data/resource.ts`

~~~
const signUpForNewsletter = defineFunction({
  entry: "./sign-up-for-newsletter/handler.ts",
});

const schema = a.schema({
  someAsyncOperation: a
.mutation()
.arguments({
  email: a.email().required(),
})
.handler(a.handler.function(signUpForNewsletter).async())
.authorization((allow) => allow.guest()),
});

~~~

| | |
| -- | -- |
| Hash | `418f1d6bf659c185` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
a.schema({
  Post: a.model({
location: a.customType({
  lat: a.float(),
  long: a.float(),
}),
content: a.string(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `43905c308842f472` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
a.schema({
  Location: a.customType({
lat: a.float(),
long: a.float(),
  }),

  Post: a.model({
location: a.ref("Location"),
content: a.string(),
  }),

  User: a.model({
lastKnownLocation: a.ref("Location"),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `f888c3d166c2cecc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
const { data: newPost, errors } = await client.models.Post.create({
  location: {
lat: 48.837006,
long: 8.28245,
  },
});

console.log(newPost?.location?.lat, newPost?.location?.long);

~~~

| | |
| -- | -- |
| Hash | `230bf27a1eb5947d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
a.schema({
  Post: a.model({
privacySetting: a.enum(["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]),
content: a.string(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `820795dcb914b7d6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
a.schema({
  PrivacySetting: a.enum(["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]),

  Post: a.model({
content: a.string(),
privacySetting: a.ref("PrivacySetting"),
  }),

  Video: a.model({
privacySetting: a.ref("PrivacySetting"),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `3285944c721301a5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
client.models.Post.create({
  content: "hello",
  // WORKS - value auto-completed
  privacySetting: "PRIVATE",

  // DOES NOT WORK - TYPE ERROR
  privacySetting: "NOT_PUBLIC",
});

~~~

| | |
| -- | -- |
| Hash | `53b6683a37d9bc50` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
const availableSettings = client.enums.PrivacySetting.values();
// availableSettings returns ["PRIVATE", "FRIENDS_ONLY", "PUBLIC"]

~~~

| | |
| -- | -- |
| Hash | `1f73a4fff6b93118` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a.model({
content: a.string().required(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `cdf4d0b665542edb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a.model({
content: a.string().required(),
notes: a.string().array(),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `dc3c19f2f62eb37c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/add-fields/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Todo: a.model({
content: a.string().default("My new Todo"),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `9f1c692ef6b1f458` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Member: a
.model({
  name: a.string().required(),
  // 1. Create a reference field
  teamId: a.id(),
  // 2. Create a belongsTo relationship with the reference field
  team: a.belongsTo("Team", "teamId"),
})
.authorization((allow) => [allow.publicApiKey()]),

  Team: a
.model({
  mantra: a.string().required(),
  // 3. Create a hasMany relationship with the reference field
  //    from the `Member`s model.
  members: a.hasMany("Member", "teamId"),
})
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `df45cee6e4cb42c5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: team } = await client.models.Team.create({
  mantra: "Go Frontend!",
});

const { data: member } = await client.models.Member.create({
  name: "Tim",
  teamId: team.id,
});

~~~

| | |
| -- | -- |
| Hash | `dc7d0a1a6d72510a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: newTeam } = await client.models.Team.create({
  mantra: "Go Fullstack",
});

await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: newTeam.id,
});

~~~

| | |
| -- | -- |
| Hash | `06214f3775b02364` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
await client.models.Member.update({
  id: "MY_MEMBER_ID",
  teamId: null,
});

~~~

| | |
| -- | -- |
| Hash | `f2ae6e917b0bc1b2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: team } = await client.models.Team.get({ id: "MY_TEAM_ID" });

const { data: members } = await team.members();

members.forEach((member) => console.log(member.id));

~~~

| | |
| -- | -- |
| Hash | `b02d88e15c6256e8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: teamWithMembers } = await client.models.Team.get(
  { id: "MY_TEAM_ID" },
  { selectionSet: ["id", "members.*"] },
);

teamWithMembers.members.forEach((member) => console.log(member.id));

~~~

| | |
| -- | -- |
| Hash | `ae43c44bff14af30` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Cart: a.model({
items: a.string().required().array(),
// 1. Create reference field
customerId: a.id(),
// 2. Create relationship field with the reference field
customer: a.belongsTo("Customer", "customerId"),
  }),
  Customer: a.model({
name: a.string(),
// 3. Create relationship field with the reference field
//    from the Cart model
activeCart: a.hasOne("Cart", "customerId"),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `6c5b797209223c96` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: customer, errors } = await client.models.Customer.create({
  name: "Rene",
});

const { data: cart } = await client.models.Cart.create({
  items: ["Tomato", "Ice", "Mint"],
  customerId: customer?.id,
});

~~~

| | |
| -- | -- |
| Hash | `c866224db025011b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: newCustomer } = await client.models.Customer.create({
  name: "Ian",
});

await client.models.Cart.update({
  id: cart.id,
  customerId: newCustomer?.id,
});

~~~

| | |
| -- | -- |
| Hash | `33c181d03567d778` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
await client.models.Cart.update({
  id: project.id,
  customerId: null,
});

~~~

| | |
| -- | -- |
| Hash | `01f88137bf80d2f9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: cart } = await client.models.Cart.get({ id: "MY_CART_ID" });
const { data: customer } = await cart.customer();

~~~

| | |
| -- | -- |
| Hash | `c5f4e8bcdb208fdd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const { data: cart } = await client.models.Cart.get(
  { id: "MY_CART_ID" },
  { selectionSet: ["id", "customer.*"] },
);

console.log(cart.customer.id);

~~~

| | |
| -- | -- |
| Hash | `edb23d7db6fb10cb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const schema = a
  .schema({
PostTag: a.model({
  // 1. Create reference fields to both ends of
  //    the many-to-many relationship
  postId: a.id().required(),
  tagId: a.id().required(),
  // 2. Create relationship fields to both ends of
  //    the many-to-many relationship using their
  //    respective reference fields
  post: a.belongsTo("Post", "postId"),
  tag: a.belongsTo("Tag", "tagId"),
}),
Post: a.model({
  title: a.string(),
  content: a.string(),
  // 3. Add relationship field to the join model
  //    with the reference of `postId`
  tags: a.hasMany("PostTag", "postId"),
}),
Tag: a.model({
  name: a.string(),
  // 4. Add relationship field to the join model
  //    with the reference of `tagId`
  posts: a.hasMany("PostTag", "tagId"),
}),
  })
  .authorization((allow) => [allow.publicApiKey()]);

~~~

| | |
| -- | -- |
| Hash | `5fc48807eeb6242d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Post: a.model({
  title: a.string().required(),
  content: a.string().required(),
  authorId: a.id(),
  author: a.belongsTo("Person", "authorId"),
  editorId: a.id(),
  editor: a.belongsTo("Person", "editorId"),
}),
Person: a.model({
  name: a.string(),
  editedPosts: a.hasMany("Post", "editorId"),
  authoredPosts: a.hasMany("Post", "authorId"),
}),
  })
  .authorization((allow) => [allow.publicApiKey()]);

~~~

| | |
| -- | -- |
| Hash | `e571f5db22f9a3e9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const client = generateClient<Schema>();

const { data: post } = await client.models.Post.get({ id: "SOME_POST_ID" });

const { data: author } = await post?.author();
const { data: editor } = await post?.editor();

~~~

| | |
| -- | -- |
| Hash | `3ff516f1c240d2e3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const schema = a
  .schema({
Post: a.model({
  title: a.string().required(),
  content: a.string().required(),
  // Reference fields must correspond to identifier fields.
  authorName: a.string(),
  authorDoB: a.date(),
  // Must pass references in the same order as identifiers.
  author: a.belongsTo("Person", ["authorName", "authorDoB"]),
}),
Person: a
  .model({
    name: a.string().required(),
    dateOfBirth: a.date().required(),
    // Must reference all reference fields corresponding to the
    // identifier of this model.
    authoredPosts: a.hasMany("Post", ["authorName", "authorDoB"]),
  })
  .identifier(["name", "dateOfBirth"]),
  })
  .authorization((allow) => [allow.publicApiKey()]);

~~~

| | |
| -- | -- |
| Hash | `f9a22fa228ec8309` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/](https://docs.amplify.aws/react/build-a-backend/data/data-modeling/relationships/)

##### `Unnamed Snippet`

~~~
const schema = a.schema({
  Post: a.model({
title: a.string().required(),
content: a.string().required(),
// You must supply an author when creating the post
// Author can't be set to `null`.
authorId: a.id().required(),
author: a.belongsTo("Person", "authorId"),
// You can optionally supply an editor when creating the post.
// Editor can also be set to `null`.
editorId: a.id(),
editor: a.belongsTo("Person", "editorId"),
  }),
  Person: a.model({
name: a.string(),
editedPosts: a.hasMany("Post", "editorId"),
authoredPosts: a.hasMany("Post", "authorId"),
  }),
});

~~~

| | |
| -- | -- |
| Hash | `129f8c5aae309b52` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>();

// Now you should be able to make CRUDL operations with the
// Data client
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};

~~~

| | |
| -- | -- |
| Hash | `074ff31ac8fcd4d4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */
const client = generateClient();

// Now you should be able to make CRUDL operations with the
// Data client
const fetchTodos = async () => {
  const { data: todos, errors } = await client.models.Todo.list();
};

~~~

| | |
| -- | -- |
| Hash | `ab5b1a4b0db8b096` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "apiKey",
});

~~~

| | |
| -- | -- |
| Hash | `214c31dd2206bfca` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "userPool",
});

~~~

| | |
| -- | -- |
| Hash | `92f1e6d948bb2f1e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "identityPool",
});

~~~

| | |
| -- | -- |
| Hash | `b7b5ef648a737b54` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const client = generateClient<Schema>({
  authMode: "oidc",
});

~~~

| | |
| -- | -- |
| Hash | `2fcbfbd338e2b642` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource"; // Path to your backend resource definition

const getAuthToken = () => "myAuthToken";
const lambdaAuthToken = getAuthToken();

const client = generateClient<Schema>({
  authMode: "lambda",
  authToken: lambdaAuthToken,
});

~~~

| | |
| -- | -- |
| Hash | `bd051f6474d8be69` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "apiKey",
});

~~~

| | |
| -- | -- |
| Hash | `f836602769f99712` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "userPool",
});

~~~

| | |
| -- | -- |
| Hash | `de5a11b2edead530` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "identityPool",
});

~~~

| | |
| -- | -- |
| Hash | `7f181ae9db749fd0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
const { data: todos, errors } = await client.models.Todo.list({
  authMode: "oidc",
});

~~~

| | |
| -- | -- |
| Hash | `274e791981c46dd6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
const getAuthToken = () => "myAuthToken";
const lambdaAuthToken = getAuthToken();

const { data: todos, errors } = await client.models.Todo.list({
  authMode: "lambda",
  authToken: lambdaAuthToken,
});

~~~

| | |
| -- | -- |
| Hash | `ac808f107270b120` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>({
  headers: {
"My-Custom-Header": "my value",
  },
});

~~~

| | |
| -- | -- |
| Hash | `486ccc64ea1f256b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const { data: blog, errors } = await client.models.Blog.get(
  { id: "myBlogId" },
  {
headers: {
  "My-Custom-Header": "my value",
},
  },
);

~~~

| | |
| -- | -- |
| Hash | `3d9cf7dde513d92c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>({
  headers: async (requestOptions) => {
console.log(requestOptions);
/* The request options allow you to customize your headers based on the request options such
   as http method, headers, request URI, and query string. These options are typically used
   to create a request signature.
{
  method: '...',
  headers: { },
  uri: '/',
  queryString: ""
}
*/
return {
  "My-Custom-Header": "my value",
};
  },
});

~~~

| | |
| -- | -- |
| Hash | `139f78578144d99f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-API/)

##### `Unnamed Snippet`

~~~
// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const res = await client.models.Blog.get(
  { id: "myBlogId" },
  {
headers: async (requestOptions) => {
  console.log(requestOptions);
  /* The request options allow you to customize your headers based on the request options such
    as http method, headers, request URI, and query string. These options are typically used
    to create a request signature.
  {
    method: '...',
    headers: { },
    uri: '/',
    queryString: ""
  }
  */
  return {
    "My-Custom-Header": "my value",
  };
},
  },
);

~~~

| | |
| -- | -- |
| Hash | `6d4cd9b69d769785` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/mutate-data/](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create({
  content: "My new todo",
  isDone: true,
});

~~~

| | |
| -- | -- |
| Hash | `526c23ab1a272548` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/mutate-data/](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const todo = {
  id: "some_id",
  content: "Updated content",
};

const { data: updatedTodo, errors } = await client.models.Todo.update(todo);

~~~

| | |
| -- | -- |
| Hash | `704cbd0a4efed24a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/mutate-data/](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const toBeDeletedTodo = {
  id: "123123213",
};

const { data: deletedTodo, errors } =
  await client.models.Todo.delete(toBeDeletedTodo);

~~~

| | |
| -- | -- |
| Hash | `a0aebe5c8b5a2797` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/mutate-data/](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const { errors, data: newTodo } = await client.models.Todo.create(
  {
content: "My new todo",
isDone: true,
  },
  {
authMode: "apiKey",
  },
);

~~~

| | |
| -- | -- |
| Hash | `4729d3f005811c37` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/mutate-data/](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)

##### `Unnamed Snippet`

~~~
const promise = client.models.Todo.create({ content: "New Todo " });
//  ^ Note: we're not awaiting the request, we're returning the promise

try {
  await promise;
} catch (error) {
  console.log(error);
  // If the error is because the request was cancelled you can confirm here.
  if (client.isCancelError(error)) {
console.log(error.message); // "my message for cancellation"
// handle user cancellation logic
  }
}

//...

// To cancel the above request
client.cancel(promise, "my message for cancellation");

~~~

| | |
| -- | -- |
| Hash | `7788520a09a949aa` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/mutate-data/](https://docs.amplify.aws/react/build-a-backend/data/mutate-data/)

##### `Unnamed Snippet`

~~~
async function makeAPICall() {
  return client.models.Todo.create({ content: "New Todo" });
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, "my error message");

~~~

| | |
| -- | -- |
| Hash | `93ed69df71688b6d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `Terminal`

~~~
# Install TanStack Query
npm i @tanstack/react-query @tanstack/react-query-devtools

~~~

| | |
| -- | -- |
| Hash | `4e3da2e6f7092d2c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  RealEstateProperty: a
.model({
  name: a.string().required(),
  address: a.string(),
})
.authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "iam",
  },
});

~~~

| | |
| -- | -- |
| Hash | `dbb4c22d4f36c962` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `src/main.tsx`

~~~
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
  </React.StrictMode>,
);

~~~

| | |
| -- | -- |
| Hash | `bd73d70c34cc832c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `src/App.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useQuery } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const {
data: realEstateProperties,
isLoading,
isSuccess,
isError: isErrorQuery,
  } = useQuery({
queryKey: ["realEstateProperties"],
queryFn: async () => {
  const response = await client.models.RealEstateProperty.list();

  const allRealEstateProperties = response.data;

  if (!allRealEstateProperties) return null;

  return allRealEstateProperties;
},
  });
  // return ...
}

~~~

| | |
| -- | -- |
| Hash | `0d73bcd54827e0ec` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
mutationFn: async (input: { name: string; address: string }) => {
  const { data: newRealEstateProperty } =
    await client.models.RealEstateProperty.create(input);
  return newRealEstateProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

  // Snapshot the previous value
  const previousRealEstateProperties = queryClient.getQueryData([
    "realEstateProperties",
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
(old: Schema["RealEstateProperty"]["type"][]) => [
  ...old,
  newRealEstateProperty,
],
    );
  }

  // Return a context object with the snapshotted value
  return { previousRealEstateProperties };
},
// If the mutation fails,
// use the context returned from onMutate to rollback
onError: (err, newRealEstateProperty, context) => {
  console.error("Error saving record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
context.previousRealEstateProperties,
    );
  }
},
// Always refetch after error or success:
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
},
  });
  // return ...
}

~~~

| | |
| -- | -- |
| Hash | `ec4b53720e5434bb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useQuery } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const currentRealEstatePropertyId = "SOME_ID";
  const {
data: realEstateProperty,
isLoading,
isSuccess,
isError: isErrorQuery,
  } = useQuery({
queryKey: ["realEstateProperties", currentRealEstatePropertyId],
queryFn: async () => {
  if (!currentRealEstatePropertyId) {
    return;
  }

  const { data: property } = await client.models.RealEstateProperty.get({
    id: currentRealEstatePropertyId,
  });
  return property;
},
  });
}

~~~

| | |
| -- | -- |
| Hash | `8bb7e8634af3b304` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
mutationFn: async (realEstatePropertyDetails: {
  id: string;
  name?: string;
  address?: string;
}) => {
  const { data: updatedProperty } =
    await client.models.RealEstateProperty.update(
realEstatePropertyDetails,
    );

  return updatedProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty: {
  id: string;
  name?: string;
  address?: string;
}) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties", newRealEstateProperty.id],
  });

  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties"],
  });

  // Snapshot the previous value
  const previousRealEstateProperty = queryClient.getQueryData([
    "realEstateProperties",
    newRealEstateProperty.id,
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", newRealEstateProperty.id],
/**
 * `newRealEstateProperty` will at first only include updated values for
 * the record. To avoid only rendering optimistic values for updated
 * fields on the UI, include the previous values for all fields:
 */
{ ...previousRealEstateProperty, ...newRealEstateProperty },
    );
  }

  // Return a context with the previous and new realEstateProperty
  return { previousRealEstateProperty, newRealEstateProperty };
},
// If the mutation fails, use the context we returned above
onError: (err, newRealEstateProperty, context) => {
  console.error("Error updating record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", context.newRealEstateProperty.id],
context.previousRealEstateProperty,
    );
  }
},
// Always refetch after error or success:
onSettled: (newRealEstateProperty) => {
  if (newRealEstateProperty) {
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties"],
    });
  }
},
  });
}

~~~

| | |
| -- | -- |
| Hash | `5527db08ca1ee1bb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
mutationFn: async (realEstatePropertyDetails: { id: string }) => {
  const { data: deletedProperty } =
    await client.models.RealEstateProperty.delete(
realEstatePropertyDetails,
    );
  return deletedProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties", newRealEstateProperty.id],
  });

  await queryClient.cancelQueries({
    queryKey: ["realEstateProperties"],
  });

  // Snapshot the previous value
  const previousRealEstateProperty = queryClient.getQueryData([
    "realEstateProperties",
    newRealEstateProperty.id,
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", newRealEstateProperty.id],
newRealEstateProperty,
    );
  }

  // Return a context with the previous and new realEstateProperty
  return { previousRealEstateProperty, newRealEstateProperty };
},
// If the mutation fails, use the context we returned above
onError: (err, newRealEstateProperty, context) => {
  console.error("Error deleting record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperty) {
    queryClient.setQueryData(
["realEstateProperties", context.newRealEstateProperty.id],
context.previousRealEstateProperty,
    );
  }
},
// Always refetch after error or success:
onSettled: (newRealEstateProperty) => {
  if (newRealEstateProperty) {
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });
    queryClient.invalidateQueries({
queryKey: ["realEstateProperties"],
    });
  }
},
  });
}

~~~

| | |
| -- | -- |
| Hash | `74b0b5f0ccd6d7dd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `Unnamed Snippet`

~~~
function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}

~~~

| | |
| -- | -- |
| Hash | `8126f5215dc69347` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `Unnamed Snippet`

~~~
<>
  {updateMutation.isError && updateMutation.error instanceof Error ? (
<div>An error occurred: {updateMutation.error.message}</div>
  ) : null}

  {updateMutation.isSuccess ? <div>Real Estate Property updated!</div> : null}

  <button
onClick={() =>
  updateMutation.mutate({
    id: realEstateProperty.id,
    address: `${Math.floor(1000 + Math.random() * 9000)} Main St`,
  })
}
  >
Update Address
  </button>
</>;

~~~

| | |
| -- | -- |
| Hash | `be047723724475e7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `src/main.tsx`

~~~
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

Amplify.configure(outputs);

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
  </React.StrictMode>,
);

~~~

| | |
| -- | -- |
| Hash | `5a0aff3caf6ca3be` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/](https://docs.amplify.aws/react/build-a-backend/data/optimistic-ui/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import "./App.css";
import { useIsFetching, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./main";
import { useState } from "react";

const client = generateClient<Schema>({
  authMode: "iam",
});

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? <div style={styles.globalLoadingIndicator}></div> : null;
}

function App() {
  const [currentRealEstatePropertyId, setCurrentRealEstatePropertyId] =
useState<string | null>(null);

  const {
data: realEstateProperties,
isLoading,
isSuccess,
isError: isErrorQuery,
  } = useQuery({
queryKey: ["realEstateProperties"],
queryFn: async () => {
  const response = await client.models.RealEstateProperty.list();

  const allRealEstateProperties = response.data;

  if (!allRealEstateProperties) return null;

  return allRealEstateProperties;
},
  });

  const createMutation = useMutation({
mutationFn: async (input: { name: string; address: string }) => {
  const { data: newRealEstateProperty } =
    await client.models.RealEstateProperty.create(input);
  return newRealEstateProperty;
},
// When mutate is called:
onMutate: async (newRealEstateProperty) => {
  // Cancel any outgoing refetches
  // (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries({ queryKey: ["realEstateProperties"] });

  // Snapshot the previous value
  const previousRealEstateProperties = queryClient.getQueryData([
    "realEstateProperties",
  ]);

  // Optimistically update to the new value
  if (previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
(old: Schema["RealEstateProperty"]["type"][]) => [
  ...old,
  newRealEstateProperty,
],
    );
  }

  // Return a context object with the snapshotted value
  return { previousRealEstateProperties };
},
// If the mutation fails,
// use the context returned from onMutate to rollback
onError: (err, newRealEstateProperty, context) => {
  console.error("Error saving record:", err, newRealEstateProperty);
  if (context?.previousRealEstateProperties) {
    queryClient.setQueryData(
["realEstateProperties"],
context.previousRealEstateProperties,
    );
  }
},
// Always refetch after error or success:
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["realEstateProperties"] });
},
  });

  function RealEstatePropertyDetailView() {
const {
  data: realEstateProperty,
  isLoading,
  isSuccess,
  isError: isErrorQuery,
} = useQuery({
  queryKey: ["realEstateProperties", currentRealEstatePropertyId],
  queryFn: async () => {
    if (!currentRealEstatePropertyId) {
return;
    }

    const { data: property } = await client.models.RealEstateProperty.get({
id: currentRealEstatePropertyId,
    });
    return property;
  },
});

const updateMutation = useMutation({
  mutationFn: async (realEstatePropertyDetails: {
    id: string;
    name?: string;
    address?: string;
  }) => {
    const { data: updatedProperty } =
await client.models.RealEstateProperty.update(
  realEstatePropertyDetails,
);

    return updatedProperty;
  },
  // When mutate is called:
  onMutate: async (newRealEstateProperty: {
    id: string;
    name?: string;
    address?: string;
  }) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });

    await queryClient.cancelQueries({
queryKey: ["realEstateProperties"],
    });

    // Snapshot the previous value
    const previousRealEstateProperty = queryClient.getQueryData([
"realEstateProperties",
newRealEstateProperty.id,
    ]);

    // Optimistically update to the new value
    if (previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", newRealEstateProperty.id],
  /**
   * `newRealEstateProperty` will at first only include updated values for
   * the record. To avoid only rendering optimistic values for updated
   * fields on the UI, include the previous values for all fields:
   */
  { ...previousRealEstateProperty, ...newRealEstateProperty },
);
    }

    // Return a context with the previous and new realEstateProperty
    return { previousRealEstateProperty, newRealEstateProperty };
  },
  // If the mutation fails, use the context we returned above
  onError: (err, newRealEstateProperty, context) => {
    console.error("Error updating record:", err, newRealEstateProperty);
    if (context?.previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", context.newRealEstateProperty.id],
  context.previousRealEstateProperty,
);
    }
  },
  // Always refetch after error or success:
  onSettled: (newRealEstateProperty) => {
    if (newRealEstateProperty) {
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties", newRealEstateProperty.id],
});
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties"],
});
    }
  },
});

const deleteMutation = useMutation({
  mutationFn: async (realEstatePropertyDetails: { id: string }) => {
    const { data: deletedProperty } =
await client.models.RealEstateProperty.delete(
  realEstatePropertyDetails,
);
    return deletedProperty;
  },
  // When mutate is called:
  onMutate: async (newRealEstateProperty) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({
queryKey: ["realEstateProperties", newRealEstateProperty.id],
    });

    await queryClient.cancelQueries({
queryKey: ["realEstateProperties"],
    });

    // Snapshot the previous value
    const previousRealEstateProperty = queryClient.getQueryData([
"realEstateProperties",
newRealEstateProperty.id,
    ]);

    // Optimistically update to the new value
    if (previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", newRealEstateProperty.id],
  newRealEstateProperty,
);
    }

    // Return a context with the previous and new realEstateProperty
    return { previousRealEstateProperty, newRealEstateProperty };
  },
  // If the mutation fails, use the context we returned above
  onError: (err, newRealEstateProperty, context) => {
    console.error("Error deleting record:", err, newRealEstateProperty);
    if (context?.previousRealEstateProperty) {
queryClient.setQueryData(
  ["realEstateProperties", context.newRealEstateProperty.id],
  context.previousRealEstateProperty,
);
    }
  },
  // Always refetch after error or success:
  onSettled: (newRealEstateProperty) => {
    if (newRealEstateProperty) {
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties", newRealEstateProperty.id],
});
queryClient.invalidateQueries({
  queryKey: ["realEstateProperties"],
});
    }
  },
});

return (
  <div style={styles.detailViewContainer}>
    <h2>Real Estate Property Detail View</h2>
    {isErrorQuery && <div>{"Problem loading Real Estate Property"}</div>}
    {isLoading && (
<div style={styles.loadingIndicator}>
  {"Loading Real Estate Property..."}
</div>
    )}
    {isSuccess && (
<div>
  <p>{`Name: ${realEstateProperty?.name}`}</p>
  <p>{`Address: ${realEstateProperty?.address}`}</p>
</div>
    )}
    {realEstateProperty && (
<div>
  <div>
    {updateMutation.isPending ? (
      "Updating Real Estate Property..."
    ) : (
      <>
        {updateMutation.isError &&
        updateMutation.error instanceof Error ? (
          <div>An error occurred: {updateMutation.error.message}</div>
        ) : null}

        {updateMutation.isSuccess ? (
          <div>Real Estate Property updated!</div>
        ) : null}

        <button
          onClick={() =>
            updateMutation.mutate({
              id: realEstateProperty.id,
              name: `Updated Home ${Date.now()}`,
            })
          }
        >
          Update Name
        </button>
        <button
          onClick={() =>
            updateMutation.mutate({
              id: realEstateProperty.id,
              address: `${Math.floor(
                1000 + Math.random() * 9000,
              )} Main St`,
            })
          }
        >
          Update Address
        </button>
      </>
    )}
  </div>

  <div>
    {deleteMutation.isPending ? (
      "Deleting Real Estate Property..."
    ) : (
      <>
        {deleteMutation.isError &&
        deleteMutation.error instanceof Error ? (
          <div>An error occurred: {deleteMutation.error.message}</div>
        ) : null}

        {deleteMutation.isSuccess ? (
          <div>Real Estate Property deleted!</div>
        ) : null}

        <button
          onClick={() =>
            deleteMutation.mutate({
              id: realEstateProperty.id,
            })
          }
        >
          Delete
        </button>
      </>
    )}
  </div>
</div>
    )}
    <button onClick={() => setCurrentRealEstatePropertyId(null)}>
Back
    </button>
  </div>
);
  }
  return (
<div>
  {!currentRealEstatePropertyId && (
    <div style={styles.appContainer}>
<h1>Real Estate Properties:</h1>
<div>
  {createMutation.isPending ? (
    "Adding Real Estate Property..."
  ) : (
    <>
      {createMutation.isError &&
      createMutation.error instanceof Error ? (
        <div>An error occurred: {createMutation.error.message}</div>
      ) : null}

      {createMutation.isSuccess ? (
        <div>Real Estate Property added!</div>
      ) : null}

      <button
        onClick={() => {
          createMutation.mutate({
            name: `New Home ${Date.now()}`,
            address: `${Math.floor(
              1000 + Math.random() * 9000,
            )} Main St`,
          });
        }}
      >
        Add RealEstateProperty
      </button>
    </>
  )}
</div>
<ul style={styles.propertiesList}>
  {isLoading && (
    <div style={styles.loadingIndicator}>
      {"Loading Real Estate Properties..."}
    </div>
  )}
  {isErrorQuery && (
    <div>{"Problem loading Real Estate Properties"}</div>
  )}
  {isSuccess &&
    realEstateProperties?.map((realEstateProperty, idx) => {
      if (!realEstateProperty) return null;
      return (
        <li
          style={styles.listItem}
          key={`${idx}-${realEstateProperty.id}`}
        >
          <p>{realEstateProperty.name}</p>
          <button
            style={styles.detailViewButton}
            onClick={() =>
              setCurrentRealEstatePropertyId(realEstateProperty.id)
            }
          >
            Detail View
          </button>
        </li>
      );
    })}
</ul>
    </div>
  )}
  {currentRealEstatePropertyId && <RealEstatePropertyDetailView />}
  <GlobalLoadingIndicator />
</div>
  );
}

export default App;

const styles = {
  appContainer: {
display: "flex",
flexDirection: "column",
alignItems: "center",
  },
  detailViewButton: { marginLeft: "1rem" },
  detailViewContainer: { border: "1px solid black", padding: "3rem" },
  globalLoadingIndicator: {
position: "fixed",
top: 0,
left: 0,
width: "100%",
height: "100%",
border: "4px solid blue",
pointerEvents: "none",
  },
  listItem: {
display: "flex",
justifyContent: "space-between",
border: "1px dotted grey",
padding: ".5rem",
margin: ".1rem",
  },
  loadingIndicator: {
border: "1px solid black",
padding: "1rem",
margin: "1rem",
  },
  propertiesList: {
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "start",
width: "50%",
border: "1px solid black",
padding: "1rem",
listStyleType: "none",
  },
} as const;

~~~

| | |
| -- | -- |
| Hash | `c229fca239cbad11` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

// list all items
const { data: todos, errors } = await client.models.Todo.list();

// get a specific item
const { data: todo, errors } = await client.models.Todo.get({
  id: "...",
});

~~~

| | |
| -- | -- |
| Hash | `d802e473c55f60ff` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const { errors, data: todos } = await client.models.Todo.list({
  authMode: "apiKey",
});

~~~

| | |
| -- | -- |
| Hash | `27083fbf217f4594` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
content: {
  beginsWith: "hello",
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `b7a13dcc42cc0f2b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const { data: todos, errors } = await client.models.Todo.list({
  filter: {
or: [
  {
    priority: { eq: "1" },
  },
  {
    priority: { eq: "2" },
  },
],
  },
});

~~~

| | |
| -- | -- |
| Hash | `805e7a16e0b5b803` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const {
  data: todos,
  nextToken, // Repeat this API call with the nextToken until the returned nextToken is `null`
  errors,
} = await client.models.Todo.list({
  limit: 100, // default value is 100
  nextToken: "eyJ2ZXJzaW9uejE1a2...", // previous nextToken
});

~~~

| | |
| -- | -- |
| Hash | `6cac5a92233f7f71` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import * as React from "react";
import { Pagination } from "@aws-amplify/ui-react";

export const PaginationHasMorePagesExample = () => {
  const [pageTokens, setPageTokens] = React.useState([null]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);

  const handleNextPage = async () => {
if (hasMorePages && currentPageIndex === pageTokens.length) {
  const { data: todos, nextToken } = await client.models.Todo.list({
    nextToken: pageTokens[pageTokens.length - 1],
  });

  if (!nextToken) {
    setHasMorePages(false);
  }

  setPageTokens([...pageTokens, nextToken]);
}

setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
<Pagination
  currentPage={currentPageIndex}
  totalPages={pageTokens.length}
  hasMorePages={hasMorePages}
  onNext={handleNextPage}
  onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}
  onChange={(pageIndex) => setCurrentPageIndex(pageIndex)}
/>
  );
};

~~~

| | |
| -- | -- |
| Hash | `af99c7c3ce818ba9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
// same way for all CRUDL: .create, .get, .update, .delete, .list, .observeQuery
const { data: blogWithSubsetOfData, errors } = await client.models.Blog.get(
  { id: blog.id },
  {
selectionSet: ["author.email", "posts.*"],
  },
);

~~~

| | |
| -- | -- |
| Hash | `c5a9d7a5cdc10664` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import { type Schema } from "@/amplify/data/resource";

type Post = Schema["Post"]["type"];

const [posts, setPosts] = useState<Post[]>([]);

~~~

| | |
| -- | -- |
| Hash | `4c106be9c8e3749e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
import type { SelectionSet } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const selectionSet = ["content", "blog.author.*", "comments.*"] as const;
type PostWithComments = SelectionSet<
  Schema["Post"]["type"],
  typeof selectionSet
>;

// ...
const [posts, setPosts] = useState<PostWithComments[]>([]);

const fetchPosts = async () => {
  const { data: postsWithComments } = await client.models.Post.list({
selectionSet,
  });
  setPosts(postsWithComments);
};

~~~

| | |
| -- | -- |
| Hash | `594df1fdc5fc0b68` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
const promise = client.models.Todo.list();
//  ^ Note: we're not awaiting the request, we're returning the promise

try {
  await promise;
} catch (error) {
  console.log(error);
  // If the error is because the request was cancelled you can confirm here.
  if (client.isCancelError(error)) {
console.log(error.message); // "my message for cancellation"
// handle user cancellation logic
  }
}
...

// To cancel the above request
client.cancel(promise, "my message for cancellation");

~~~

| | |
| -- | -- |
| Hash | `e84aa109193880d4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/query-data/](https://docs.amplify.aws/react/build-a-backend/data/query-data/)

##### `Unnamed Snippet`

~~~
async function makeAPICall() {
  return client.models.Todo.list();
}
const promise = makeAPICall();

// The following will NOT cancel the request.
client.cancel(promise, "my error message");

~~~

| | |
| -- | -- |
| Hash | `5b7af56d08383ae9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

type Todo = Schema["Todo"]["type"];

const client = generateClient<Schema>();

export default function MyComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
const sub = client.models.Todo.observeQuery().subscribe({
  next: ({ items, isSynced }) => {
    setTodos([...items]);
  },
});
return () => sub.unsubscribe();
  }, []);

  return (
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.content}</li>
  ))}
</ul>
  );
}

~~~

| | |
| -- | -- |
| Hash | `19bebafef196be7c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
// Defining your selection set `as const` ensures the types
// propagate through to the response objects.
const selectionSet = ['title', 'author', 'posts.*'] as const;

const sub = client.models.Blog.observeQuery(
  filter: { id: { eq: 'blog-id' } },
  selectionSet: [...selectionSet]
).subscribe({
  next(data) {
handle(data.items)
  }
});

// The update uses the same selection set, ensuring all the
// required fields are provided to the subscriber.
const { data } = await client.models.Blog.update({
  id: 'blog-id',
  name: 'Updated Name'
}, {
  selectionSet: [...selectionSet]
});

~~~

| | |
| -- | -- |
| Hash | `ceec33b4e66930a2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
// Notice how we're fetching a few `Blog` details, but mostly using
// the selection set to grab all the related posts.
const selectionSet = ['title', 'author', 'posts.*'] as const;

const sub = client.models.Blog.observeQuery(
  filter: { id: { eq: 'blog-id' } },
  selectionSet: [...selectionSet]
).subscribe({
  next(data) {
handle(data.items)
  }
});

~~~

| | |
| -- | -- |
| Hash | `211161dff2eb4646` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
async function addPostToBlog(
  post: Schema["Post"]["createType"],
  blog: Schema["Blog"]["type"],
) {
  // Create the post first.
  await client.models.Post.create({
...post,
blogId: blog.id,
  });

  // "Touch" the blog, notifying subscribers to re-render.
  await client.models.Blog.update(
{
  id: blog.id,
},
{
  // Remember to include the selection set if the subscription
  // is looking for related-model fields!
  selectionSet: [...selectionSet],
},
  );
}

~~~

| | |
| -- | -- |
| Hash | `92b382c0ac2298ec` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

// Subscribe to creation of Todo
const createSub = client.models.Todo.onCreate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to update of Todo
const updateSub = client.models.Todo.onUpdate().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Subscribe to deletion of Todo
const deleteSub = client.models.Todo.onDelete().subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

// Stop receiving data updates from the subscription
createSub.unsubscribe();
updateSub.unsubscribe();
deleteSub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `837a78504eebfe1e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

const sub = client.models.Todo.onCreate({
  filter: {
content: {
  contains: "groceries",
},
  },
}).subscribe({
  next: (data) => console.log(data),
  error: (error) => console.warn(error),
});

~~~

| | |
| -- | -- |
| Hash | `dd37adfa68dc80a8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
import { CONNECTION_STATE_CHANGE, ConnectionState } from "aws-amplify/data";
import { Hub } from "aws-amplify/utils";

Hub.listen("api", (data: any) => {
  const { payload } = data;
  if (payload.event === CONNECTION_STATE_CHANGE) {
const connectionState = payload.data.connectionState as ConnectionState;
console.log(connectionState);
  }
});

~~~

| | |
| -- | -- |
| Hash | `3d50d3d345883f3f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
import { generateClient, CONNECTION_STATE_CHANGE, ConnectionState } from 'aws-amplify/data'
import { Hub } from 'aws-amplify/utils'
import { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>()

const fetchRecentData = () => {
  const { data: allTodos } = await client.models.Todo.list();
}

let priorConnectionState: ConnectionState;

Hub.listen("api", (data: any) => {
  const { payload } = data;
  if (
payload.event === CONNECTION_STATE_CHANGE
  ) {

if (priorConnectionState === ConnectionState.Connecting && payload.data.connectionState === ConnectionState.Connected) {
  fetchRecentData();
}
priorConnectionState = payload.data.connectionState;
  }
});

const createSub = client.models.Todo.onCreate().subscribe({
  next: payload => // Process incoming messages
});

const updateSub = client.models.Todo.onUpdate().subscribe({
  next: payload => // Process incoming messages
});

const deleteSub = client.models.Todo.onDelete().subscribe({
  next: payload => // Process incoming messages
});

const cleanupSubscriptions = () => {
  createSub.unsubscribe();
  updateSub.unsubscribe();
  deleteSub.unsubscribe();
}

~~~

| | |
| -- | -- |
| Hash | `ccefe4830defbe18` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/](https://docs.amplify.aws/react/build-a-backend/data/subscribe-data/)

##### `Unnamed Snippet`

~~~
// Stop receiving data updates from the subscription
sub.unsubscribe();

~~~

| | |
| -- | -- |
| Hash | `982a132bf936968c` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `amplify/data/resource.ts`

~~~
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
.model({
  content: a.string(),
  isDone: a.boolean(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",
apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});

~~~

| | |
| -- | -- |
| Hash | `7a897658524a2d0b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `Terminal`

~~~
npm add aws-amplify

~~~

| | |
| -- | -- |
| Hash | `1759cbd7cc5e4599` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `src/TodoList.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const createTodo = async () => {
await client.models.Todo.create({
  content: window.prompt("Todo content?"),
  isDone: false,
});
  };

  return (
<div>
  <button onClick={createTodo}>Add new todo</button>
</div>
  );
}

~~~

| | |
| -- | -- |
| Hash | `2f36362b325fd6f9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `src/TodoList.tsx`

~~~
import { useState, useEffect } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  const fetchTodos = async () => {
const { data: items, errors } = await client.models.Todo.list();
setTodos(items);
  };

  useEffect(() => {
fetchTodos();
  }, []);

  const createTodo = async () => {
await client.models.Todo.create({
  content: window.prompt("Todo content?"),
  isDone: false,
});

fetchTodos();
  };

  return (
<div>
  <button onClick={createTodo}>Add new todo</button>
  <ul>
    {todos.map(({ id, content }) => (
<li key={id}>{content}</li>
    ))}
  </ul>
</div>
  );
}

~~~

| | |
| -- | -- |
| Hash | `c18fb667c9efe229` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `src/App.tsx`

~~~
import type { Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);

  useEffect(() => {
const sub = client.models.Todo.observeQuery().subscribe({
  next: ({ items }) => {
    setTodos([...items]);
  },
});

return () => sub.unsubscribe();
  }, []);

  const createTodo = async () => {
await client.models.Todo.create({
  content: window.prompt("Todo content?"),
  isDone: false,
});
// no more manual refetchTodos required!
// - fetchTodos()
  };

  return (
<div>
  <button onClick={createTodo}>Add new todo</button>
  <ul>
    {todos.map(({ id, content }) => (
<li key={id}>{content}</li>
    ))}
  </ul>
</div>
  );
}

~~~

| | |
| -- | -- |
| Hash | `c4e9900baed037f1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Song: a
.model({
  id: a.id().required(),
  name: a.string().required(),
  coverArtPath: a.string(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "apiKey",

apiKeyAuthorizationMode: {
  expiresInDays: 30,
},
  },
});

~~~

| | |
| -- | -- |
| Hash | `3bcf491dc036739b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `amplify/storage/resource.ts`

~~~
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplify-gen2-files",
  access: (allow) => ({
"images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});

~~~

| | |
| -- | -- |
| Hash | `6679822de1d0953f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";

export const backend = defineBackend({
  auth,
  data,
  storage,
});

~~~

| | |
| -- | -- |
| Hash | `1368a6d0f77630fd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Create the API record:
const response = await client.models.Song.create({
  name: `My first song`,
});

const song = response.data;

if (!song) return;

// Upload the Storage file:
const result = await uploadData({
  path: `images/${song.id}-${file.name}`,
  data: file,
  options: {
contentType: "image/png", // contentType is optional
  },
}).result;

// Add the file association to the record:
const updateResponse = await client.models.Song.update({
  id: song.id,
  coverArtPath: result?.path,
});

const updatedSong = updateResponse.data;

setCurrentSong(updatedSong);

// If the record has no associated file, we can return early.
if (!updatedSong.coverArtPath) return;

// Retrieve the file's signed URL:
const signedURL = await getUrl({ path: updatedSong.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `029aeb50b55f5f09` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload the Storage file:
const result = await uploadData({
  path: `images/${currentSong.id}-${file.name}`,
  data: file,
  options: {
contentType: "image/png", // contentType is optional
  },
}).result;

// Add the file association to the record:
const response = await client.models.Song.update({
  id: currentSong.id,
  coverArtPath: result?.path,
});

const updatedSong = response.data;

setCurrentSong(updatedSong);

// If the record has no associated file, we can return early.
if (!updatedSong?.coverArtPath) return;

// Retrieve the file's signed URL:
const signedURL = await getUrl({ path: updatedSong.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `a5c47b142daa7dbd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

// Retrieve the signed URL:
const signedURL = await getUrl({ path: song.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `2e56e96cc6a6b8fb` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

const updatedSong = await client.models.Song.update({
  id: song.id,
  coverArtPath: null,
});

~~~

| | |
| -- | -- |
| Hash | `a40d2f553ca941bf` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});
const response = await client.models.Song.get({
  id: currentSong.id,
});
const song = response?.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

// Remove associated file from record
const updatedSong = await client.models.Song.update({
  id: song.id,
  coverArtPath: null,
});

// Delete the file from S3:
await remove({ path: song.coverArtPath });

~~~

| | |
| -- | -- |
| Hash | `94503f216a88c5dd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});
const response = await client.models.Song.get({
  id: currentSong.id,
});

const song = response.data;

// If the record has no associated file, we can return early.
if (!song?.coverArtPath) return;

await remove({ path: song.coverArtPath });

// Delete the record from the API:
await client.models.Song.delete({ id: song.id });

~~~

| | |
| -- | -- |
| Hash | `41626ca14e050c9f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `amplify/data/resource.ts`

~~~
const schema = a.schema({
  PhotoAlbum: a
.model({
  id: a.id().required(),
  name: a.string().required(),
  imagePaths: a.string().array(),
})
.authorization((allow) => [allow.publicApiKey()]),
});

~~~

| | |
| -- | -- |
| Hash | `f401c7fceb6e060e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Create the API record:
const response = await client.models.PhotoAlbum.create({
  name: `My first photoAlbum`,
});

const photoAlbum = response.data.createPhotoAlbum;

if (!photoAlbum) return;

// Upload all files to Storage:
const imagePaths = await Promise.all(
  Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${photoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
  }),
);

const updatePhotoAlbumDetails = {
  id: photoAlbum.id,
  imagePaths: imagePaths,
};

// Add the file association to the record:
const updateResponse = await client.graphql({
  query: mutations.updatePhotoAlbum,
  variables: { input: updatePhotoAlbumDetails },
});

const updatedPhotoAlbum = updateResponse.data.updatePhotoAlbum;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum.imageKeys?.length) return;

// Retrieve signed urls for all files:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
  ),
);

~~~

| | |
| -- | -- |
| Hash | `0c37acb6ac67ddb6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload all files to Storage:
const newimagePaths = await Promise.all(
  Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
  }),
);

// Query existing record to retrieve currently associated files:
const queriedResponse = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = queriedResponse.data;

if (!photoAlbum?.imagePaths) return;

// Merge existing and new file paths:
const updatedimagePaths = [...newimagePaths, ...photoAlbum.imagePaths];

// Update record with merged file associations:
const response = await client.models.PhotoAlbum.update({
  id: currentPhotoAlbum.id,
  imagePaths: updatedimagePaths,
});

const updatedPhotoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum?.imageKeys) return;

// Retrieve signed urls for merged image paths:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
  ),
);

~~~

| | |
| -- | -- |
| Hash | `bf7c47146a1f7b61` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

// Upload new file to Storage:
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
contentType: "image/png", // contentType is optional
  },
}).result;

const newFilePath = result.path;

// Query existing record to retrieve currently associated files:
const queriedResponse = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = queriedResponse.data;

if (!photoAlbum?.imagePaths?.length) return;

// Retrieve last image path:
const [lastImagePath] = photoAlbum.imagePaths.slice(-1);

// Remove last file association by path
const updatedimagePaths = [
  ...photoAlbum.imagePaths.filter((path) => path !== lastImagePath),
  newFilePath,
];

// Update record with updated file associations:
const response = await client.models.PhotoAlbum.update({
  id: currentPhotoAlbum.id,
  imagePaths: updatedimagePaths,
});

const updatedPhotoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!updatedPhotoAlbum?.imagePaths) return;

// Retrieve signed urls for merged image paths:
const signedUrls = await Promise.all(
  updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
  ),
);

~~~

| | |
| -- | -- |
| Hash | `af889ca92491fe0b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
async function getImagesForPhotoAlbum() {
  import { generateClient } from "aws-amplify/api";
  import { uploadData, getUrl } from "aws-amplify/storage";
  import type { Schema } from "../amplify/data/resource";

  // Generating the client
  const client = generateClient<Schema>({
authMode: "apiKey",
  });

  // Query the record to get the file paths:
  const response = await client.models.PhotoAlbum.get({
id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  // If the record has no associated files, we can return early.
  if (!photoAlbum?.imagePaths) return;

  // Retrieve the signed URLs for the associated images:
  const signedUrls = await Promise.all(
photoAlbum.imagePaths.map(async (imagePath) => {
  if (!imagePath) return;
  return await getUrl({ path: imagePath });
}),
  );
}

~~~

| | |
| -- | -- |
| Hash | `4fdf4d5d37bed3a9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated file, we can return early.
if (!photoAlbum?.imagePaths) return;

const updatedPhotoAlbum = await client.models.PhotoAlbum.update({
  id: photoAlbum.id,
  imagePaths: null,
});

~~~

| | |
| -- | -- |
| Hash | `fe8b7733d3c4a338` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

// If the record has no associated files, we can return early.
if (!photoAlbum?.imagePaths) return;

// Remove associated files from record
const updateResponse = await client.models.PhotoAlbum.update({
  id: photoAlbum.id,
  imagePaths: null, // Set the file association to `null`
});

const updatedPhotoAlbum = updateResponse.data;

// Delete the files from S3:
await Promise.all(
  photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
  }),
);

~~~

| | |
| -- | -- |
| Hash | `815d4373de20c7b5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import { generateClient } from "aws-amplify/api";
import { remove } from "aws-amplify/storage";
import type { Schema } from "../amplify/data/resource";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

const response = await client.models.PhotoAlbum.get({
  id: currentPhotoAlbum.id,
});

const photoAlbum = response.data;

if (!photoAlbum) return;

await client.models.PhotoAlbum.delete({
  id: photoAlbum.id,
});

setCurrentPhotoAlbum(null);

// If the record has no associated file, we can return early.
if (!photoAlbum?.imagePaths) return;

await Promise.all(
  photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
  }),
);

~~~

| | |
| -- | -- |
| Hash | `2fccce5d41438e41` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import "./App.css";
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import React, { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import {
  type WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

type Song = Schema["Song"]["type"];

function App({ signOut, user }: WithAuthenticatorProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Used to display image for current song:
  const [currentImageUrl, setCurrentImageUrl] = useState<
string | null | undefined
  >("");

  async function createSongWithImage(e: React.ChangeEvent<HTMLInputElement>) {
if (!e.target.files) return;
const file = e.target.files[0];
try {
  // Create the API record:
  const response = await client.models.Song.create({
    name: `My first song`,
  });

  const song = response.data;

  if (!song) return;

  // Upload the Storage file:
  const result = await uploadData({
    path: `images/${song.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  // Add the file association to the record:
  const updateResponse = await client.models.Song.update({
    id: song.id,
    coverArtPath: result?.path,
  });

  const updatedSong = updateResponse.data;
  setCurrentSong(updatedSong);

  // If the record has no associated file, we can return early.
  if (!updatedSong?.coverArtPath) return;

  // Retrieve the file's signed URL:
  const signedURL = await getUrl({ path: updatedSong.coverArtPath });

  setCurrentImageUrl(signedURL.url.toString());
} catch (error) {
  console.error("Error create song / file:", error);
}
  }

  // Upload image, add to song, retrieve signed URL and retrieve the image.
  // Also updates image if one already exists.
  async function addNewImageToSong(e: React.ChangeEvent<HTMLInputElement>) {
if (!currentSong) return;

if (!e.target.files) return;

const file = e.target.files[0];

try {
  // Upload the Storage file:
  const result = await uploadData({
    path: `images/${currentSong.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  // Add the file association to the record:
  const response = await client.models.Song.update({
    id: currentSong.id,
    coverArtPath: result?.path,
  });

  const updatedSong = response.data;

  setCurrentSong(updatedSong);

  // If the record has no associated file, we can return early.
  if (!updatedSong?.coverArtPath) return;

  // Retrieve the file's signed URL:
  const signedURL = await getUrl({ path: updatedSong.coverArtPath });
  setCurrentImageUrl(signedURL.url.toString());
} catch (error) {
  console.error("Error uploading image / adding image to song: ", error);
}
  }

  async function getImageForCurrentSong() {
if (!currentSong) return;

try {
  // Query the record to get the file path:
  const response = await client.models.Song.get({
    id: currentSong.id,
  });

  const song = response.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  // Retrieve the signed URL:
  const signedURL = await getUrl({ path: song.coverArtPath });
  setCurrentImageUrl(signedURL.url.toString());
} catch (error) {
  console.error("Error getting song / image:", error);
}
  }

  // Remove the file association, continue to persist both file and record
  async function removeImageFromSong() {
if (!currentSong) return;

try {
  const response = await client.models.Song.get({
    id: currentSong.id,
  });

  const song = response.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  const updatedSong = await client.models.Song.update({
    id: song.id,
    coverArtPath: null,
  });

  // If successful, the response here will be `null`:
  setCurrentSong(updatedSong.data);

  setCurrentImageUrl(updatedSong.data?.coverArtPath);
} catch (error) {
  console.error("Error removing image from song: ", error);
}
  }

  // Remove the record association and delete the file
  async function deleteImageForCurrentSong() {
if (!currentSong) return;

try {
  const response = await client.models.Song.get({
    id: currentSong.id,
  });

  const song = response?.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  // Remove associated file from record
  const updatedSong = await client.models.Song.update({
    id: song.id,
    coverArtPath: null,
  });

  // Delete the file from S3:
  await remove({ path: song.coverArtPath });

  // If successful, the response here will be `null`:
  setCurrentSong(updatedSong.data);

  setCurrentImageUrl(updatedSong.data?.coverArtPath);
} catch (error) {
  console.error("Error deleting image: ", error);
}
  }

  // Delete both file and record
  async function deleteCurrentSongAndImage() {
if (!currentSong) return;
try {
  const response = await client.models.Song.get({
    id: currentSong.id,
  });
  const song = response.data;

  // If the record has no associated file, we can return early.
  if (!song?.coverArtPath) return;

  await remove({ path: song.coverArtPath });

  // Delete the record from the API:
  await client.models.Song.delete({ id: song.id });

  clearLocalState();
} catch (error) {
  console.error("Error deleting song: ", error);
}
  }

  function clearLocalState() {
setCurrentSong(null);
setCurrentImageUrl("");
  }

  return (
<>
  <h1>Hello {user?.username}</h1>
  <button onClick={signOut}>Sign out</button>
  <div>
    <label>
<h2>{`Current Song: ${currentSong?.id}`}</h2>
Create song with file:
<input id="name" type="file" onChange={createSongWithImage} />
    </label>
    <label>
Add / update song image:
<input
  id="name"
  type="file"
  onChange={addNewImageToSong}
  disabled={!currentSong}
/>
    </label>
    <button
onClick={getImageForCurrentSong}
disabled={!currentSong || !currentImageUrl}
    >
Get image for current song
    </button>
    <button
onClick={removeImageFromSong}
disabled={!currentSong || !currentImageUrl}
    >
Remove image from current song (does not delete image)
    </button>
    <button
onClick={deleteImageForCurrentSong}
disabled={!currentSong || !currentImageUrl}
    >
Remove image from current song, then delete image
    </button>
    <button onClick={deleteCurrentSongAndImage} disabled={!currentSong}>
Delete current song (and image, if it exists)
    </button>
    <button onClick={signOut} className="app-button">
Sign out
    </button>
  </div>
</>
  );
}

export default withAuthenticator(App);

~~~

| | |
| -- | -- |
| Hash | `5d3534d04eccf558` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/data/working-with-files/](https://docs.amplify.aws/react/build-a-backend/data/working-with-files/)

##### `src/App.tsx`

~~~
import "./App.css";
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import React, { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import {
  type WithAuthenticatorProps,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

type PhotoAlbum = Schema["PhotoAlbum"]["type"];

function App({ signOut, user }: WithAuthenticatorProps) {
  // State to hold the recognized text
  const [currentPhotoAlbum, setCurrentPhotoAlbum] = useState<PhotoAlbum | null>(
null,
  );

  // Used to display images for current photoAlbum:
  const [currentImages, setCurrentImages] = useState<
(string | null | undefined)[] | null | undefined
  >([]);

  async function createPhotoAlbumWithFirstImage(
e: React.ChangeEvent<HTMLInputElement>,
  ) {
if (!e.target.files) return;

const file = e.target.files[0];

try {
  // Create the API record:
  const response = await client.models.PhotoAlbum.create({
    name: `My first photoAlbum`,
  });

  const photoAlbum = response.data;

  if (!photoAlbum) return;

  // Upload the Storage file:
  const result = await uploadData({
    path: `images/${photoAlbum.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  const updatePhotoAlbumDetails = {
    id: photoAlbum.id,
    imagePaths: [result.path],
  };

  // Add the file association to the record:
  const updateResponse = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: [result.path],
  });

  const updatedPhotoAlbum = updateResponse.data;

  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths?.length) return;

  // Retrieve the file's signed URL:
  const signedURL = await getUrl({
    path: updatedPhotoAlbum.imagePaths[0]!,
  });
  setCurrentImages([signedURL.url.toString()]);
} catch (error) {
  console.error("Error create photoAlbum / file:", error);
}
  }

  async function createPhotoAlbumWithMultipleImages(
e: React.ChangeEvent<HTMLInputElement>,
  ) {
if (!e.target.files) return;

try {
  const photoAlbumDetails = {
    name: `My first photoAlbum`,
  };

  // Create the API record:
  const response = await client.models.PhotoAlbum.create({
    name: `My first photoAlbum`,
  });

  const photoAlbum = response.data;

  if (!photoAlbum) return;

  // Upload all files to Storage:
  const imagePaths = await Promise.all(
    Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${photoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
    }),
  );

  // Add the file association to the record:
  const updateResponse = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: imagePaths,
  });
  const updatedPhotoAlbum = updateResponse.data;

  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths?.length) return;

  // Retrieve signed urls for all files:
  const signedUrls = await Promise.all(
    updatedPhotoAlbum.imagePaths.map(
async (path) => await getUrl({ path: path! }),
    ),
  );

  if (!signedUrls) return;
  setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
} catch (error) {
  console.error("Error create photoAlbum / file:", error);
}
  }

  async function addNewImagesToPhotoAlbum(
e: React.ChangeEvent<HTMLInputElement>,
  ) {
if (!currentPhotoAlbum) return;

if (!e.target.files) return;

try {
  // Upload all files to Storage:
  const newimagePaths = await Promise.all(
    Array.from(e.target.files).map(async (file) => {
const result = await uploadData({
  path: `images/${currentPhotoAlbum.id}-${file.name}`,
  data: file,
  options: {
    contentType: "image/png", // contentType is optional
  },
}).result;

return result.path;
    }),
  );

  // Query existing record to retrieve currently associated files:
  const queriedResponse = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = queriedResponse.data;

  if (!photoAlbum?.imagePaths) return;

  // Merge existing and new file paths:
  const updatedimagePaths = [...newimagePaths, ...photoAlbum.imagePaths];

  // Update record with merged file associations:
  const response = await client.models.PhotoAlbum.update({
    id: currentPhotoAlbum.id,
    imagePaths: updatedimagePaths,
  });

  const updatedPhotoAlbum = response.data;
  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths) return;

  // Retrieve signed urls for merged image paths:
  const signedUrls = await Promise.all(
    updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
    ),
  );

  if (!signedUrls) return;

  setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
} catch (error) {
  console.error(
    "Error uploading image / adding image to photoAlbum: ",
    error,
  );
}
  }

  // Replace last image associated with current photoAlbum:
  async function updateLastImage(e: React.ChangeEvent<HTMLInputElement>) {
if (!currentPhotoAlbum) return;

if (!e.target.files) return;

const file = e.target.files[0];

try {
  // Upload new file to Storage:
  const result = await uploadData({
    path: `images/${currentPhotoAlbum.id}-${file.name}`,
    data: file,
    options: {
contentType: "image/png", // contentType is optional
    },
  }).result;

  const newFilePath = result.path;

  // Query existing record to retrieve currently associated files:
  const queriedResponse = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = queriedResponse.data;

  if (!photoAlbum?.imagePaths?.length) return;

  // Retrieve last image path:
  const [lastImagePath] = photoAlbum.imagePaths.slice(-1);

  // Remove last file association by path
  const updatedimagePaths = [
    ...photoAlbum.imagePaths.filter((path) => path !== lastImagePath),
    newFilePath,
  ];

  // Update record with updated file associations:
  const response = await client.models.PhotoAlbum.update({
    id: currentPhotoAlbum.id,
    imagePaths: updatedimagePaths,
  });

  const updatedPhotoAlbum = response.data;

  setCurrentPhotoAlbum(updatedPhotoAlbum);

  // If the record has no associated file, we can return early.
  if (!updatedPhotoAlbum?.imagePaths) return;

  // Retrieve signed urls for merged image paths:
  const signedUrls = await Promise.all(
    updatedPhotoAlbum?.imagePaths.map(
async (path) => await getUrl({ path: path! }),
    ),
  );

  if (!signedUrls) return;

  setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
} catch (error) {
  console.error(
    "Error uploading image / adding image to photoAlbum: ",
    error,
  );
}
  }

  async function getImagesForPhotoAlbum() {
if (!currentPhotoAlbum) {
  return;
}
try {
  // Query the record to get the file paths:
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });
  const photoAlbum = response.data;

  // If the record has no associated files, we can return early.
  if (!photoAlbum?.imagePaths) return;

  // Retrieve the signed URLs for the associated images:
  const signedUrls = await Promise.all(
    photoAlbum.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
return await getUrl({ path: imagePath });
    }),
  );

  setCurrentImages(
    signedUrls.map((signedUrl) => signedUrl?.url.toString()),
  );
} catch (error) {
  console.error("Error getting photoAlbum / image:", error);
}
  }

  // Remove the file associations, continue to persist both files and record
  async function removeImagesFromPhotoAlbum() {
if (!currentPhotoAlbum) return;

try {
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  // If the record has no associated file, we can return early.
  if (!photoAlbum?.imagePaths) return;

  const updatedPhotoAlbum = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: null,
  });

  // If successful, the response here will be `null`:
  setCurrentPhotoAlbum(updatedPhotoAlbum.data);
  setCurrentImages(updatedPhotoAlbum.data?.imagePaths);
} catch (error) {
  console.error("Error removing image from photoAlbum: ", error);
}
  }

  // Remove the record association and delete the file
  async function deleteImagesForCurrentPhotoAlbum() {
if (!currentPhotoAlbum) return;

try {
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  // If the record has no associated files, we can return early.
  if (!photoAlbum?.imagePaths) return;

  // Remove associated files from record
  const updateResponse = await client.models.PhotoAlbum.update({
    id: photoAlbum.id,
    imagePaths: null, // Set the file association to `null`
  });

  const updatedPhotoAlbum = updateResponse.data;

  // Delete the files from S3:
  await Promise.all(
    photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
    }),
  );

  // If successful, the response here will be `null`:
  setCurrentPhotoAlbum(updatedPhotoAlbum);
  setCurrentImages(null);
} catch (error) {
  console.error("Error deleting image: ", error);
}
  }

  // Delete both files and record
  async function deleteCurrentPhotoAlbumAndImages() {
if (!currentPhotoAlbum) return;

try {
  const response = await client.models.PhotoAlbum.get({
    id: currentPhotoAlbum.id,
  });

  const photoAlbum = response.data;

  if (!photoAlbum) return;

  await client.models.PhotoAlbum.delete({
    id: photoAlbum.id,
  });

  setCurrentPhotoAlbum(null);

  // If the record has no associated file, we can return early.
  if (!photoAlbum?.imagePaths) return;

  await Promise.all(
    photoAlbum?.imagePaths.map(async (imagePath) => {
if (!imagePath) return;
await remove({ path: imagePath });
    }),
  );

  clearLocalState();
} catch (error) {
  console.error("Error deleting photoAlbum: ", error);
}
  }

  function clearLocalState() {
setCurrentPhotoAlbum(null);
setCurrentImages([]);
  }

  return (
<main className="app-container">
  <h1 className="greeting">Hello {user?.username}!</h1>
  <h2 className="current-album">
    Current PhotoAlbum: {currentPhotoAlbum?.id}
  </h2>

  <div className="file-input-container">
    <label className="file-input-label">
Create photoAlbum with one file:
<input
  type="file"
  accept="image/*"
  onChange={createPhotoAlbumWithFirstImage}
  className="file-input"
/>
    </label>

    <label className="file-input-label">
Create photoAlbum with multiple files:
<input
  type="file"
  accept="image/*"
  onChange={createPhotoAlbumWithMultipleImages}
  multiple
  className="file-input"
/>
    </label>

    <label className="file-input-label">
Add multiple images to current photoAlbum:
<input
  type="file"
  accept="image/*"
  onChange={addNewImagesToPhotoAlbum}
  disabled={!currentPhotoAlbum}
  multiple
  className="file-input"
/>
    </label>

    <label className="file-input-label">
Replace last image:
<input
  type="file"
  accept="image/*"
  onChange={updateLastImage}
  disabled={!currentPhotoAlbum || !currentImages}
  className="file-input"
/>
    </label>
  </div>

  <div className="button-container">
    <button
onClick={getImagesForPhotoAlbum}
disabled={!currentPhotoAlbum || !currentImages}
className="app-button"
    >
Get Images for Current Photo Album
    </button>
    <button
onClick={removeImagesFromPhotoAlbum}
disabled={!currentPhotoAlbum || !currentImages}
className="app-button"
    >
Remove images from current PhotoAlbum (does not delete images)
    </button>
    <button
onClick={deleteImagesForCurrentPhotoAlbum}
disabled={!currentPhotoAlbum || !currentImages}
className="app-button"
    >
Remove images from current PhotoAlbum, then delete images
    </button>
    <button
onClick={deleteCurrentPhotoAlbumAndImages}
disabled={!currentPhotoAlbum}
className="app-button"
    >
Delete current PhotoAlbum (and images, if they exist)
    </button>
    <button onClick={signOut} className="app-button">
Sign out
    </button>
  </div>

  <div className="image-container">
    {currentImages &&
currentImages.map((url, idx) => {
  if (!url) return undefined;
  return (
    <img src={url} key={idx} alt="Storage file" className="image" />
  );
})}
  </div>
</main>
  );
}

export default withAuthenticator(App);

~~~

| | |
| -- | -- |
| Hash | `2aa2fbfd92b49cdf` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/)

##### `Terminal`

~~~
npm add @aws-lambda-powertools/logger @types/aws-lambda

~~~

| | |
| -- | -- |
| Hash | `971716d4c93fe3b6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/)

##### `amplify/functions/kinesis-function/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const myKinesisFunction = defineFunction({
  name: "kinesis-function",
});

~~~

| | |
| -- | -- |
| Hash | `8f81a185041222d2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/)

##### `amplify/functions/kinesis-function/handler.ts`

~~~
import type {
  KinesisStreamBatchResponse,
  KinesisStreamHandler,
  KinesisStreamRecordPayload,
} from "aws-lambda";
import { Buffer } from "node:buffer";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "kinesis-stream-handler",
});

export const handler: KinesisStreamHandler = async (
  event,
  context,
): Promise<KinesisStreamBatchResponse> => {
  for (const record of event.Records) {
try {
  logger.info(`Processed Kinesis Event - EventID: ${record.eventID}`);
  const recordData = await getRecordDataAsync(record.kinesis);
  logger.info(`Record Data: ${recordData}`);
} catch (err) {
  logger.error(`An error occurred ${err}`);
  /*
  When processing stream data, if any item fails, returning the failed item's position immediately
  prompts Lambda to retry from this item forward, ensuring continuous processing without skipping data.
  */
  return {
    batchItemFailures: [{ itemIdentifier: record.kinesis.sequenceNumber }],
  };
}
  }
  logger.info(`Successfully processed ${event.Records.length} records.`);
  return { batchItemFailures: [] };
};

async function getRecordDataAsync(
  payload: KinesisStreamRecordPayload,
): Promise<string> {
  const data = Buffer.from(payload.data, "base64").toString("utf-8");
  await Promise.resolve(1); // Placeholder for an async process
  return data;
}

~~~

| | |
| -- | -- |
| Hash | `39fa4e3a9d6197d9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/](https://docs.amplify.aws/react/build-a-backend/functions/examples/kinesis-stream/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { Stream } from "aws-cdk-lib/aws-kinesis";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { KinesisEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { myKinesisFunction } from "./functions/kinesis-function/resource";

const backend = defineBackend({
  auth,
  data,
  myKinesisFunction,
});

const kinesisStack = backend.createStack("kinesis-stack");

const kinesisStream = new Stream(kinesisStack, "KinesisStream", {
  streamName: "myKinesisStream",
  shardCount: 1,
});

const eventSource = new KinesisEventSource(kinesisStream, {
  startingPosition: StartingPosition.LATEST,
  reportBatchItemFailures: true,
});

backend.myKinesisFunction.resources.lambda.addEventSource(eventSource);

~~~

| | |
| -- | -- |
| Hash | `839e597bc631f205` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/)

##### `amplify/functions/say-hello/resource.ts`

~~~
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: "say-hello",
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: "./handler.ts",
});

~~~

| | |
| -- | -- |
| Hash | `7f6cf64d79fd0683` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/)

##### `amplify/functions/say-hello/handler.ts`

~~~
import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  // your function code goes here
  return "Hello, World!";
};

~~~

| | |
| -- | -- |
| Hash | `937259d927dccabc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/)

##### `amplify/backend.ts`

~~~
import { defineBackend } from "@aws-amplify/backend";
import { sayHello } from "./functions/say-hello/resource";

defineBackend({
  sayHello,
});

~~~

| | |
| -- | -- |
| Hash | `1ac3057102a272e1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/)

##### `amplify/data/resource.ts`

~~~
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sayHello } from "../functions/say-hello/resource";

const schema = a.schema({
  sayHello: a
.query()
.arguments({
  name: a.string(),
})
.returns(a.string())
.handler(a.handler.function(sayHello)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
defaultAuthorizationMode: "iam",
  },
});

~~~

| | |
| -- | -- |
| Hash | `ffcef2e09d7f1abe` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/)

##### `amplify/functions/say-hello/handler.ts`

~~~
import type { Schema } from "../../data/resource";

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  // arguments typed from `.arguments()`
  const { name } = event.arguments;
  // return typed from `.returns()`
  return `Hello, ${name}!`;
};

~~~

| | |
| -- | -- |
| Hash | `8f38a781d49b259d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/](https://docs.amplify.aws/react/build-a-backend/functions/set-up-function/)

##### `src/main.ts`

~~~
import type { Schema } from "./amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "./amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

client.queries.sayHello({
  name: "Amplify",
});

~~~

| | |
| -- | -- |
| Hash | `fde03d3112494569` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/troubleshooting/cannot-find-module-amplify-env/](https://docs.amplify.aws/react/build-a-backend/troubleshooting/cannot-find-module-amplify-env/)

##### `tsconfig.json`

~~~
{
  "exclude": ["amplify/**/*"]
}

~~~

| | |
| -- | -- |
| Hash | `9f5432bf9c0150d4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/troubleshooting/cannot-find-module-amplify-env/](https://docs.amplify.aws/react/build-a-backend/troubleshooting/cannot-find-module-amplify-env/)

##### `package.json`

~~~
{
  "name": "my-backend",
  "private": true,
  "exports": {
"./schema": "./amplify/data/resource.ts",
"./outputs": "./amplify_outputs.json"
  }
}

~~~

| | |
| -- | -- |
| Hash | `20eb39b36497e0a9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Terminal`

~~~
npm add aws-amplify @aws-amplify/adapter-nextjs

~~~

| | |
| -- | -- |
| Hash | `8689eafef8e07e47` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import outputs from "@/amplify_outputs.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});

~~~

| | |
| -- | -- |
| Hash | `bf2e41aba91ab1d5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
"use client";

import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";

Amplify.configure(outputs, {
  ssr: true, // required when using Amplify with Next.js
});

export default function RootLayoutThatConfiguresAmplifyOnTheClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

~~~

| | |
| -- | -- |
| Hash | `3baa0ac91eb98ddc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
"use client";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}

~~~

| | |
| -- | -- |
| Hash | `f219aab938f63266` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplifyClientSide";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<html lang="en">
  <body className="container pb-6">
    <>
<ConfigureAmplifyClientSide />
{children}
    </>
  </body>
</html>
  );
}

~~~

| | |
| -- | -- |
| Hash | `cbb6f8c4879ba10d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
nextServerContext: { request, response },
operation: async (contextSpec) => {
  try {
    const session = await fetchAuthSession(contextSpec);
    return (
session.tokens?.accessToken !== undefined &&
session.tokens?.idToken !== undefined
    );
  } catch (error) {
    console.log(error);
    return false;
  }
},
  });

  if (authenticated) {
return response;
  }

  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: [
/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 */
"/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)",
  ],
};

~~~

| | |
| -- | -- |
| Hash | `10c6492fd438d91e` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `next.config.js`

~~~
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
serverComponentsExternalPackages: ["@aws-crypto"],
  },
};

~~~

| | |
| -- | -- |
| Hash | `557d8255f490c784` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
import { cookies } from "next/headers";
import { getCurrentUser } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";

// This page always dynamically renders per request
export const dynamic = "force-dynamic";

export default async function AuthGetCurrentUserServer() {
  try {
const currentUser = await runWithAmplifyServerContext({
  nextServerContext: { cookies },
  operation: (contextSpec) => getCurrentUser(contextSpec),
});

return (
  <AuthFetchResult
    description="The API is called on the server side."
    data={currentUser}
  />
);
  } catch (error) {
console.error(error);
return <p>Something went wrong...</p>;
  }
}

~~~

| | |
| -- | -- |
| Hash | `78c26838ef9c22f4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
import { getUrl } from "aws-amplify/storage/server";
import Image from "next/image";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";

// Re-render this page every 60 minutes
export const revalidate = 60 * 60; // in seconds

export default async function StaticallyRenderedPage() {
  try {
const splashUrl = await runWithAmplifyServerContext({
  nextServerContext: null,
  operation: (contextSpec) =>
    getUrl(contextSpec, {
key: "splash.png",
    }),
});

return (
  <Image
    src={splashUrl.url.toString()}
    alt="Splash Image"
    width={500}
    height={500}
  />
);
  } catch (error) {
console.error(error);
return <p>Something went wrong...</p>;
  }
}

~~~

| | |
| -- | -- |
| Hash | `557ac1e38174bddd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
import { getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";

export async function GET() {
  const user = await runWithAmplifyServerContext({
nextServerContext: { cookies },
operation: (contextSpec) => getCurrentUser(contextSpec),
  });

  return NextResponse.json({ user });
}

~~~

| | |
| -- | -- |
| Hash | `3580536425fbfa26` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const currentUser = await runWithAmplifyServerContext({
nextServerContext: { request: req, response: res },
operation: (contextSpec) => getCurrentUser(contextSpec),
  });

  return { props: { currentUser } };
};

~~~

| | |
| -- | -- |
| Hash | `c485918a99f92f58` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/build-a-backend/server-side-rendering/](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)

##### `Unnamed Snippet`

~~~
export async function getStaticProps() {
  const splashUrl = await runWithAmplifyServerContext({
nextServerContext: null,
operation: (contextSpec) => getUrl(contextSpec, { key: "splash.png" }),
  });

  return {
props: { imageUrl: splashUrl.url.toString() },
revalidate: (splashUrl.expiresAt.getTime() - Date.now()) / 1000, // in seconds
  };
}

~~~

| | |
| -- | -- |
| Hash | `ee0e7701ec29a7a3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/branch-deployments/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/branch-deployments/)

##### `Terminal`

~~~
git checkout -b feature/A

## make some edits to your code

git commit --am "New data model to track comments for todos added"

git push origin feature/A

~~~

| | |
| -- | -- |
| Hash | `91330c3134e7aa91` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/branch-deployments/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/branch-deployments/)

##### `Terminal`

~~~
npx ampx generate outputs --app-id <your-amplify-app-id> --branch <your-git-branch-name> --out-dir <path/to/config>

~~~

| | |
| -- | -- |
| Hash | `86876fc0d71196f7` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/)

##### `Unnamed Snippet`

~~~
├── apps/
│   ├── admin-dashboard/
│   │   ├── next.config.mjs
│   │   └── package.json
│   └── marketing-site/
│       ├── astro.config.mjs
│       └── package.json
├── packages/
│   └── my-shared-backend/
│       ├── amplify/
│       │   ├── auth/
│       │   │   └── resource.ts
│       │   ├── data/
│       │   │   └── resource.ts
│       │   └── backend.ts
│       |── package.json
    └── tsconfig.json
└── package.json

~~~

| | |
| -- | -- |
| Hash | `24ba8fa46ca0b5dc` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/)

##### `Terminal`

~~~
npx ampx generate outputs --branch main --app-id BACKEND-APP-ID

~~~

| | |
| -- | -- |
| Hash | `08fd21f5eafe9848` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/)

##### `Terminal`

~~~
npx ampx generate outputs --branch main --app-id BACKEND-APP-ID

~~~

| | |
| -- | -- |
| Hash | `08fd21f5eafe9848` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/)

##### `tsconfig.json`

~~~
{
  "compilerOptions": {
"paths": {
  "@/data-schema": ["./packages/my-shared-backend/amplify/data/resource"]
}
  }
}

~~~

| | |
| -- | -- |
| Hash | `be4357236b96055a` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/)

##### `apps/admin-dashboard/page.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/data-schema";

const client = generateClient<Schema>();

const createTodo = async () => {
  await client.models.Todo.create({
content: window.prompt("Todo content?"),
isDone: false,
  });
};

~~~

| | |
| -- | -- |
| Hash | `3137a2b60aedf773` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `apps/admin-dashboard/page.tsx`

~~~
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/data-schema";

const client = generateClient<Schema>();

const createTodo = async () => {
  await client.models.Todo.create({
content: window.prompt("Todo content?"),
isDone: false,
  });
};

~~~

| | |
| -- | -- |
| Hash | `3137a2b60aedf773` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `Terminal`

~~~
npm create next-app@14 -- multi-repo-example --typescript --eslint --no-app --no-src-dir --no-tailwind --import-alias '@/*'

~~~

| | |
| -- | -- |
| Hash | `9e86939baa24d516` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `Terminal`

~~~
cd multi-repo-example
npm add @aws-amplify/backend-cli aws-amplify @aws-amplify/ui-react

~~~

| | |
| -- | -- |
| Hash | `a96f0f3bf3b26739` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `Terminal`

~~~
npx ampx generate outputs --branch main --app-id <your-backend-app-id>

~~~

| | |
| -- | -- |
| Hash | `7665aa8c85d9a3b4` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `pages/_app.tsx`

~~~
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

// configure the Amplify client library with the configuration generated by `ampx sandbox`
Amplify.configure(outputs);

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withAuthenticator(App);

~~~

| | |
| -- | -- |
| Hash | `39c8cf957000e6ac` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `Unnamed Snippet`

~~~
version: 1
backend:
  phases:
build:
  commands:
    - npm ci --cache .npm --prefer-offline
    - npx ampx generate outputs --branch main --app-id BACKEND-APPID
frontend:
  phases:
build:
  commands:
    - npm run build
  artifacts:
baseDirectory: .next
files:
  - '**/*'
  cache:
paths:
  - .next/cache/**/*
  - .npm/**/*
  - node_modules/**/*

~~~

| | |
| -- | -- |
| Hash | `c151f94686992927` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `amplify.yml`

~~~
version: 1
backend:
  phases:
build:
  commands:
    - npm ci --cache .npm --prefer-offline
    - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
build:
  commands:
    - mkdir ./dist && touch ./dist/index.html
    - curl -X POST -d {} "https://webhooks.amplify.ca-central-1.amazonaws.com/prod/webhooks?id=WEBHOOK-ID&token=TOKEN&operation=startbuild" -H "Content-Type:application/json"
  artifacts:
baseDirectory: dist
files:
  - '**/*'
  cache:
paths:
  - node_modules/**/*

~~~

| | |
| -- | -- |
| Hash | `1f61d10d39fa9a83` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/mono-and-multi-repos/)

##### `tsconfig.json`

~~~
{
  "compilerOptions": {
"paths": {
  "@/data-schema": ["../backend-app/amplify/data/resource"]
}
  }
}

~~~

| | |
| -- | -- |
| Hash | `c74ee7916c8ae999` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox secret set foo
? Enter secret value: ###
Done!

npx ampx sandbox secret set bar
? Enter secret value: ###
Done!

~~~

| | |
| -- | -- |
| Hash | `177325bd7103d995` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox secret list
 - foo
 - bar

~~~

| | |
| -- | -- |
| Hash | `9e94e7e14cde9252` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox secret get foo
name: foo
version: 1
value: abc123
lastUpdated: Mon Nov 13 2023 22:19:12 GMT-0800 (Pacific Standard Time)

~~~

| | |
| -- | -- |
| Hash | `9cf830d5a5340ca0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox secret set foo --profile work

~~~

| | |
| -- | -- |
| Hash | `cc09b88bc8ecbeec` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox --identifier feature1sandbox

~~~

| | |
| -- | -- |
| Hash | `83d31f061c8eaf8b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox --identifier feature2sandbox

~~~

| | |
| -- | -- |
| Hash | `84b833ec4343dc7d` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox --identifier feature1sandbox secret set baz

~~~

| | |
| -- | -- |
| Hash | `a08360d3543e0fee` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Terminal`

~~~
npx ampx sandbox --outputs-out-dir ./path/to/config --outputs-format ["json", "dart"]

~~~

| | |
| -- | -- |
| Hash | `e1d0dea68bca6848` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx generate outputs --app-id <your-amplify-app-id> --branch main --format ["json", "dart"] --out-dir ./path/to/config

~~~

| | |
| -- | -- |
| Hash | `7874ae3a5848eda9` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Terminal`

~~~
npx ampx generate outputs --app-id <app-id> --branch main

~~~

| | |
| -- | -- |
| Hash | `0c0d50bd53d09ce1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/features/)

##### `Unnamed Snippet`

~~~
npx ampx generate graphql-client-code
--format [choices: "modelgen", "graphql-codegen", "introspection"]

~~~

| | |
| -- | -- |
| Hash | `28167ac180eae7dd` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Terminal`

~~~
git clone https://github.com/<github-user>/amplify-vite-react-template.git
cd amplify-vite-react-template && npm install

~~~

| | |
| -- | -- |
| Hash | `ed16cc50ccab928b` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Unnamed Snippet`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `src/App.tsx`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Terminal`

~~~
npm run dev

~~~

| | |
| -- | -- |
| Hash | `29238ffc8ab45ff8` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `src/App.tsx`

~~~
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
// ... other imports

function App() {
  // ...
  return (
<Authenticator>
  {({ signOut }) => (
    <main>
{/*...*/}
<button onClick={signOut}>Sign out</button>
    </main>
  )}
</Authenticator>
  );
}

~~~

| | |
| -- | -- |
| Hash | `3774e58f1afbc0d2` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Terminal`

~~~
git commit -am "added authenticator"
git push

~~~

| | |
| -- | -- |
| Hash | `f3e938672d9247e5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `amplify/data/resource.ts`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `src/App.tsx`

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
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Terminal`

~~~
git commit -am "added per-user data isolation"
git push

~~~

| | |
| -- | -- |
| Hash | `c16d632aa0af79e6` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/react/](https://docs.amplify.aws/react/)

##### `amplify/backend.ts`

~~~
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";

const backend = defineBackend({
  auth,
  data,
});

const customResourceStack = backend.createStack("MyCustomResources");

new sqs.Queue(customResourceStack, "CustomQueue");
new sns.Topic(customResourceStack, "CustomTopic");

~~~

| | |
| -- | -- |
| Hash | `193a2a390fb5a565` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### [https://docs.amplify.aws/](https://docs.amplify.aws/)

##### `amplify/backend.ts`

~~~
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

const customResourceStack = backend.createStack("MyCustomResources");

new sqs.Queue(customResourceStack, "CustomQueue");
new sns.Topic(customResourceStack, "CustomTopic");

~~~

| | |
| -- | -- |
| Hash | `fe8797e13aaa1221` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to summary](summary.md)
