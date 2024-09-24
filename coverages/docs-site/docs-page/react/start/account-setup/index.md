[<- Back to index](../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/start/account-setup/

Coverage: 0.0%

#### `CloudShell`

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

#### `Unnamed Snippet`

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

#### `CloudShell`

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

#### `CloudShell`

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

#### `Unnamed Snippet`

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

#### `Terminal`

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

#### `Terminal`

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

#### `Terminal`

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

#### `~/.aws/config`

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

#### `Terminal`

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

#### `Unnamed Snippet`

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

[<- Back to index](../../../../docs-pages.md)
