[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/pr-previews/

Coverage: 0.0%

#### `amplify.yml`

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

[<- Back to index](../../../../../docs-pages.md)
