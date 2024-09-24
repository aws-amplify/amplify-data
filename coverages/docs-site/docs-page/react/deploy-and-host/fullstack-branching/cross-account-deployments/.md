[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/cross-account-deployments/

Coverage: 0.0%

#### `Terminal`

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

[<- Back to index](../../../../../docs-pages.md)
