import { configure } from '../../src/internals';
import { a } from '../../index';

const fakeSecret = () => ({}) as any;

const datasourceConfigMySQL = {
  engine: 'mysql',
  connectionUri: fakeSecret(),
} as const;

describe('internals - configure', () => {
  test('configure can set databaseType to SQL', () => {
    const schema = configure({ database: datasourceConfigMySQL })
      .schema({
        widget: a
          .model({
            title: a.string().required(),
            someOwnerField: a.string(),
            owner: a.string(),
          })
          .authorization([]),
      })
      .authorization([a.allow.owner()]);

    expect(schema.transform().schema).toMatchSnapshot();
  });

  test('configured SQL schema errors on transformation when implicit fields are used', () => {
    const schema = configure({ database: datasourceConfigMySQL })
      .schema({
        widget: a.model({
          title: a.string().required(),
          someOwnerField: a.string(),
        }),
      })
      .authorization([a.allow.owner()]);

    expect(() => schema.transform().schema).toThrowError(
      "Field owner isn't defined.",
    );
  });
});
