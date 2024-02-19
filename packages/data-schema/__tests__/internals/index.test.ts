import { configure } from '../../src/internals';
import { a } from '../../index';

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  hostname: fakeSecret(),
  username: fakeSecret(),
  password: fakeSecret(),
  port: fakeSecret(),
  databaseName: fakeSecret(),
} as const;

describe('internals - configure', () => {
  test('configure can set databaseType to SQL', () => {
    const schema = configure({ database: datasourceConfigMySQL })
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
