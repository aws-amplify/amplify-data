[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/troubleshooting/stack-cdktoolkit-already-exists/

Coverage: 0.0%

#### `Amplify`

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

#### `AWS`

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

#### `Terminal`

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

[<- Back to index](../../../../../docs-pages.md)
