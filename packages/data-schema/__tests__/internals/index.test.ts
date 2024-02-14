import { configure } from '../../src/internals';
import { a } from '../../';

describe('internals - configure', () => {
  test('configure can set databaseType to SQL', () => {
    const schema = configure({ databaseType: 'SQL' })
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            someOwnerField: a.string(),
          })
          .authorization([]),
      })
      .authorization([a.allow.owner()]);

    expect(schema.transform().schema).toMatchSnapshot();
  });
});
