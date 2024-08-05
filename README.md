## Amplify Data Schema Builder

TypeScript-first AWS AppSync Schema Builder

```ts
import { a, type ClientSchema } from '@aws-amplify/data-schema';

const schema = a.schema({
  Post: a.model({
    id: a.id(),
    title: a.string(),
    comments: a.hasMany('Comment', 'postId'),
  }),
  Comment: a.model({
    id: a.id(),
    content: a.string(),
    postId: a.id(),
    post: a.belongsTo('Post', 'postId'),
  }),
});

export type Schema = ClientSchema<typeof schema>;
```

## In-repository E2E tests

See the [e2e-tests README](packages/e2e-tests/README.md) for more information.

Additionally, these tests can be run directly from the root of this repository
(see the relevant E2E scripts in the [package.json](package.json)).

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
