## amplify-api-next

TypeScript-first AWS AppSync Schema Builder

```ts
import {
  default as a,
  type ClientSchema,
  defineData,
} from '@aws-amplify/amplify-api-next-alpha';

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

export default defineData({
  schema,
});
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
