import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a } from '../src/index';
import { defineFunctionStub } from './utils';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

it('requires a model to have at least one auth rule - no authorization calls', () => {
  const schema = a.schema({
    widget: a.model({
      title: a.string().required(),
      someOwnerField: a.string(),
    }),
  });

  expect(() => schema.transform().schema).toThrow(
    'missing authorization rules',
  );
});

it('requires a model to have at least one auth rule - empty model authorization call', () => {
  const schema = a.schema({
    widget: a
      .model({
        title: a.string().required(),
        someOwnerField: a.string(),
      })
      .authorization((allow) => []),
  });

  expect(() => schema.transform().schema).toThrow(
    'missing authorization rules',
  );
});

it('requires non-empty schema definition', () => {
  // @ts-expect-error Argument of type '{}' is not assignable to parameter of type 'never'
  const schema = a.schema({});
});

it('requires a model to have at least one auth rule - empty global authorization call', () => {
  const schema = a
    .schema({
      widget: a.model({
        title: a.string().required(),
        someOwnerField: a.string(),
      }),
    })
    .authorization((allow) => []);

  expect(() => schema.transform().schema).toThrow(
    'missing authorization rules',
  );
});

it('empty model auth inherits global auth', () => {
  const schema = a
    .schema({
      widget: a
        .model({
          title: a.string().required(),
          someOwnerField: a.string(),
        })
        .authorization((allow) => []),
    })
    .authorization((allow) => allow.owner());

  expect(schema.transform().schema).toMatchSnapshot();
});

describe('Lambda resource access', () => {
  it('schema lambda access', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => allow.resource(fn1));

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: fn1,
        actions: ['query', 'mutate', 'listen'],
      },
    ]);
  });

  it('schema lambda access single action', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => allow.resource(fn1).to(['query']));

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: fn1,
        actions: ['query'],
      },
    ]);
  });

  it('schema lambda access - multiple fns', () => {
    const fn1 = defineFunctionStub({});
    const fn2 = defineFunctionStub({});
    const fn3 = defineFunctionStub({});

    const schema = a
      .schema({
        Todo: a
          .model({
            content: a.string(),
          })
          .authorization((allow) => allow.publicApiKey()),
      })
      .authorization((allow) => [
        allow.resource(fn1).to(['query']),
        allow.resource(fn2).to(['mutate']),
        allow.resource(fn3).to(['listen']),
      ]);

    const { functionSchemaAccess } = schema.transform();
    expect(functionSchemaAccess).toEqual([
      {
        resourceProvider: fn1,
        actions: ['query'],
      },
      {
        resourceProvider: fn2,
        actions: ['mutate'],
      },
      {
        resourceProvider: fn3,
        actions: ['listen'],
      },
    ]);
  });
});

describe('custom operation argument inputs', () => {

  it('when the argument is an array of custom type refs the input is an array refs', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().required(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType').array(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a required custom type ref the input is a required ref', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().required(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType').required(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a required array of custom type refs the input is a required array', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().required(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType').array().required(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is an array of required custom type refs the input is an array of required refs', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().required(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType').required().array(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a required array of required custom type refs the input is a required array of required refs', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().required(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType').required().array().required(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is an array of enum the input is an array', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testEnum: a.enum(['test1', 'test2']),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testEnum').array(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a required enum the input is required', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testEnum: a.enum(['test1', 'test2']),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testEnum').required(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a required array of enum refs the input is a required array', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testEnum: a.enum(['test1', 'test2']),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testEnum').array().required(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is an array of required enum refs the input is a array of required refs', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testEnum: a.enum(['test1', 'test2']),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testEnum').required().array(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a required array of required enum refs the input is a required array of required refs', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testEnum: a.enum(['test1', 'test2']),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testEnum').required().array().required(),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a custom type with an array field the input types field is an array', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().array(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType'),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

  it('when the argument is a custom type with a required field the input types field is required', () => {
    const fn1 = defineFunctionStub({});

    const schema = a
      .schema({
        testType: a.customType({
          testField: a.string().required(),
        }),

        testMutation: a
          .mutation()
          .arguments({
            testArgument: a.ref('testType'),
          })
          .returns(a.string())
          .handler(a.handler.function(fn1))
      })
      .authorization((allow) => allow.owner());

    expect(schema.transform().schema).toMatchSnapshot();
  });

})
