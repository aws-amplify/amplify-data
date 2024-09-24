[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/custom-pipelines/

Coverage: 0.0%

#### `Unnamed Snippet`

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

#### `Unnamed Snippet`

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

[<- Back to index](../../../../../docs-pages.md)
