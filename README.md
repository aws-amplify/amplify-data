## Amplify Data Schema Builder

TypeScript-first AWS AppSync Schema Builder

```ts
import { a, type ClientSchema } from '@aws-amplify/data-schema';

const schema = a.schema({
  Post: a.model({
    id: a.id(),
    title: a.string(),
    comments: a.hasMany('Comment'),
  }),
  Comment: a.model({
    id: a.id(),
    content: a.string(),
    post: a.belongsTo('Post'),
  }),
});

export type Schema = ClientSchema<typeof schema>;
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
