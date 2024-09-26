[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/share-resources/

Coverage: 100.0%

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
| Covered | ✅ |

##### Covering Regions

- [../../packages/integration-tests/\_\_tests\_\_/defined-behavior/4-uncovered/deploy-and-host/index.ts](../../../../../../../packages/integration-tests/__tests__/defined-behavior/4-uncovered/deploy-and-host/index.ts#16)

---

[<- Back to index](../../../../../docs-pages.md)
