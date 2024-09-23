[<- Back to summary](summary.md)

# Covered Docs Snippets

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/reference/project-structure.ts#9)
- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/sandbox-environments/setup.ts#10)

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `CloudShell`

~~~
read -p "Enter email address: " user_email # hit enter

~~~

| | |
| -- | -- |
| Hash | `41bd29a5a3cfeebd` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11)

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Unnamed Snippet`

~~~
Enter email address: <your-email-address>

~~~

| | |
| -- | -- |
| Hash | `4d8dd49ba8bbad6c` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#11)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#13)

---

#### [https://docs.amplify.aws/react/start/account-setup/](https://docs.amplify.aws/react/start/account-setup/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox --profile <value>

~~~

| | |
| -- | -- |
| Hash | `8c8f1482d8698a80` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#15](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/account-setup.ts#15)

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
npm create amplify@latest

~~~

| | |
| -- | -- |
| Hash | `49c40ffdf76ab492` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
? Where should we create your project? (.) # press enter

~~~

| | |
| -- | -- |
| Hash | `d8b7d661117c2360` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
npm add --save-dev @aws-amplify/backend@latest @aws-amplify/backend-cli@latest typescript

~~~

| | |
| -- | -- |
| Hash | `1ee5fa5533406d7c` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#9)

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Unnamed Snippet`

~~~
The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import("@aws-amplify/backend")' call instead.

~~~

| | |
| -- | -- |
| Hash | `46e660ca9e2b4a99` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)

---

#### [https://docs.amplify.aws/react/start/manual-installation/](https://docs.amplify.aws/react/start/manual-installation/)

##### `Terminal`

~~~
npm update @aws-amplify/backend@latest @aws-amplify/backend-cli@latest

~~~

| | |
| -- | -- |
| Hash | `e02df4dc8f85e45e` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/start/manual-installation.ts#11)

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/3-exhaustive/ssr-req-res-client.ts#108](../../packages/integration-tests/__tests__/defined-behavior/3-exhaustive/ssr-req-res-client.ts#108)

---

#### [https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/](https://docs.amplify.aws/react/build-a-backend/data/connect-to-existing-data-sources/connect-postgres-mysql-database/)

##### `Unnamed Snippet`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7)

---

#### [https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/)

##### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7)

---

#### [https://docs.amplify.aws/react/build-a-backend/data/set-up-data/](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

##### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7)

---

#### [https://docs.amplify.aws/react/start/quickstart/](https://docs.amplify.aws/react/start/quickstart/)

##### `Terminal`

~~~
npx ampx sandbox

~~~

| | |
| -- | -- |
| Hash | `4149df77ccfbb696` |
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7](../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/common.ts#7)

---

[<- Back to summary](summary.md)
