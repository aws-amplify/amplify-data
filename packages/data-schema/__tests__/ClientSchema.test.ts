import { expectTypeTestsToPassAsync } from 'jest-tsd';
import { a, ClientSchema } from '../index';
import {
  Expect,
  Equal,
  Prettify,
  __modelMeta__,
  AuthMode,
  CustomHeaders,
  SingularReturnValue,
} from '@aws-amplify/data-schema-types';
import { configure } from '../src/internals';
import { Nullable } from '../src/ModelField';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});

describe('schema generation', () => {
  test('with relationships', () => {
    const schema = a
      .schema({
        BoringParent: a.model({
          childNormal: a.hasOne('BoringChild'),
          childReciprocal: a.hasOne('BoringReciprocalChild'),
          childHasManyNormal: a.hasMany('BoringHasManyChild'),
          childHasManyReciprocal: a.hasMany('ReciprocalHasManyChild'),
        }),
        BoringChild: a.model({
          value: a.string(),
        }),
        BoringReciprocalChild: a.model({
          parent: a.belongsTo('BoringParent'),
          value: a.string(),
        }),
        BoringHasManyChild: a.model({
          value: a.string(),
        }),
        ReciprocalHasManyChild: a.model({
          value: a.string(),
          parent: a.belongsTo('BoringParent'),
        }),
        CPKParent: a
          .model({
            CPKParentIdFieldA: a.id().required(),
            CPKParentIdFieldB: a.id().required(),
            childNormal: a.hasOne('CPKChild'),
            childReciprocal: a.hasOne('CPKReciprocalChild'),
            childHasManyNormal: a.hasMany('CPKHasManyChild'),
            childHasManyReciprocal: a.hasMany('CPKReciprocalHasManyChild'),
          })
          .identifier(['CPKParentIdFieldA', 'CPKParentIdFieldB']),
        CPKChild: a
          .model({
            CPKChildIdFieldA: a.id().required(),
            CPKChildIdFieldB: a.id().required(),
            value: a.string(),
          })
          .identifier(['CPKChildIdFieldA', 'CPKChildIdFieldB']),
        CPKReciprocalChild: a
          .model({
            CPKReciprocalChildIdFieldA: a.id().required(),
            CPKReciprocalChildIdFieldB: a.id().required(),
            parent: a.belongsTo('CPKParent'),
            value: a.string(),
          })
          .identifier([
            'CPKReciprocalChildIdFieldA',
            'CPKReciprocalChildIdFieldB',
          ]),
        CPKHasManyChild: a
          .model({
            CPKHasManyChildIdFieldA: a.id().required(),
            CPKHasManyChildIdFieldB: a.id().required(),
            value: a.string(),
          })
          .identifier(['CPKHasManyChildIdFieldA', 'CPKHasManyChildIdFieldB']),
        CPKReciprocalHasManyChild: a
          .model({
            CPKReciprocalHasManyChildIdFieldA: a.id().required(),
            CPKReciprocalHasManyChildIdFieldB: a.id().required(),
            value: a.string(),
            parent: a.belongsTo('CPKParent'),
          })
          .identifier([
            'CPKReciprocalHasManyChildIdFieldA',
            'CPKReciprocalHasManyChildIdFieldB',
          ]),
        ReferencedBoringParent: a.model({
          childNormal: a
            .hasOne('ReferencedBoringChild')
            .references(['bcRefId']),
          childReciprocal: a
            .hasOne('ReferencedBoringReciprocalChild')
            .references(['brcRefId']),
          childHasManyNormal: a
            .hasMany('ReferencedBoringHasManyChild')
            .references(['bhmRefId']),
          childHasManyReciprocal: a
            .hasMany('ReferencedReciprocalHasManyChild')
            .references(['rrhmRefId']),
        }),
        ReferencedBoringChild: a.model({
          bcRefId: a.string(),
          value: a.string(),
        }),
        ReferencedBoringReciprocalChild: a.model({
          brcRefId: a.string(),
          parent: a
            .belongsTo('ReferencedBoringParent')
            .references(['brcRefId']),
          value: a.string(),
        }),
        ReferencedBoringHasManyChild: a.model({
          bhmRefId: a.string(),
          value: a.string(),
        }),
        ReferencedReciprocalHasManyChild: a.model({
          rrhmRefId: a.string(),
          value: a.string(),
          parent: a
            .belongsTo('ReferencedBoringParent')
            .references(['rrhmRefId']),
        }),
        LateReferencedBoringParent: a.model({}),
        LateReferencedBoringChild: a.model({
          bcRefId: a.string(),
          value: a.string(),
        }),
        LateReferencedBoringReciprocalChild: a.model({
          brcRefId: a.string(),
          value: a.string(),
        }),
        LateReferencedBoringHasManyChild: a.model({
          bhmRefId: a.string(),
          value: a.string(),
        }),
        LateReferencedReciprocalHasManyChild: a.model({
          rrhmRefId: a.string(),
          value: a.string(),
        }),
      })
      .authorization([a.allow.public()]);

    schema.models.LateReferencedBoringParent.addRelationships({
      childNormal: a
        .hasOne('LateReferencedBoringChild')
        .references(['bcRefId']),
      childReciprocal: a
        .hasOne('LateReferencedBoringReciprocalChild')
        .references(['brcRefId']),
      childHasManyNormal: a
        .hasMany('LateReferencedBoringHasManyChild')
        .references(['bhmRefId']),
      childHasManyReciprocal: a
        .hasMany('LateReferencedReciprocalHasManyChild')
        .references(['rrhmRefId']),
    });

    schema.models.LateReferencedBoringReciprocalChild.addRelationships({
      parent: a.belongsTo('ReferencedBoringParent').references(['brcRefId']),
    });

    schema.models.LateReferencedReciprocalHasManyChild.addRelationships({
      parent: a.belongsTo('ReferencedBoringParent').references(['rrhmRefId']),
    });

    expect(schema.transform().schema).toMatchSnapshot();
  });
});

describe('schema auth rules', () => {
  test('can define public auth with no provider', () => {
    const schema = a.schema({
      A: a
        .model({
          field: a.string(),
        })
        .authorization([a.allow.public()]),
    });

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  test('allows public', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.public()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('global public auth - multiple models', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
        B: a.model({
          field: a.json(),
        }),
        C: a.model({
          d: a.hasOne('D'),
        }),
        D: a.model({
          can: a.integer(),
          you: a.boolean(),
          tell: a.float(),
          i: a.date(),
          am: a.ipAddress(),
          getting: a.url(),
          tired: a.enum(['?']),
        }),
      })
      .authorization([a.allow.public()]);
    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows multiple entries', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.public(), a.allow.private()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows private', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.private()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows owner', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.owner()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied owner field
      owner?: string | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows multipleOwners', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.multipleOwners()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied owner field
      owner?: string[] | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows custom', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.custom()]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows groupDefinedIn', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.owner().inField('someField')]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied owner field
      someField?: string | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows groupsDefinedIn', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.groupsDefinedIn('someField')]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;

      // implied groups field
      someField?: string[] | undefined;
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('disallows specificGroup', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.specificGroup('group')]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  test('allows specificGroups', () => {
    const schema = a
      .schema({
        A: a.model({
          field: a.string(),
        }),
      })
      .authorization([a.allow.specificGroups(['a', 'b'])]);

    type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

    type Expected_A = {
      readonly id: string;
      readonly createdAt: string;
      readonly updatedAt: string;
      field?: string | null | undefined;
      // no implied owner field
    };

    type test = Expect<Equal<Actual_A, Expected_A>>;

    expect(schema.transform()).toMatchSnapshot();
  });

  describe('prefers model auth over global auth', () => {
    test('public auth on model vs owner auth on schema', () => {
      const schema = a
        .schema({
          A: a
            .model({
              field: a.string(),
            })
            .authorization([a.allow.public()]),
        })
        .authorization([a.allow.owner()]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        // no implied owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(schema.transform()).toMatchSnapshot();
    });

    test('owner auth on model vs public auth on schema', () => {
      const schema = a
        .schema({
          A: a
            .model({
              field: a.string(),
            })
            .authorization([a.allow.owner()]),
        })
        .authorization([a.allow.public()]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        owner?: string | undefined;
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(schema.transform()).toMatchSnapshot();
    });

    test('owner auth on model vs owner auth on schema', () => {
      const schema = a
        .schema({
          A: a
            .model({
              field: a.string(),
            })
            .authorization([a.allow.owner().inField('modelOwnerField')]),
        })
        .authorization([a.allow.owner().inField('schemaOwnerField')]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        readonly id: string;
        readonly createdAt: string;
        readonly updatedAt: string;
        field?: string | null | undefined;
        modelOwnerField?: string | undefined;
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(schema.transform()).toMatchSnapshot();
    });
  });

  test('do not pull out custom operations', () => {
    const schema = a
      .schema({
        Post: a.model({
          title: a.string(),
        }),
        likePost: a
          .mutation()
          .arguments({ postId: a.string() })
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        getLikedPost: a
          .query()
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
        onLikePost: a
          .subscription()
          .for(a.ref('likePost'))
          .returns(a.ref('Post'))
          .handler(a.handler.function('myFunc')),
      })
      .authorization([a.allow.owner()]);

    expect(schema.transform()).toMatchSnapshot();
  });
});

describe('custom operations', () => {
  test('custom query', () => {
    const schema = a.schema({
      EchoResult: a.customType({
        resultContent: a.string(),
      }),
      echo: a
        .query()
        .arguments({
          inputContent: a.string().required(),
        })
        .returns(a.ref('EchoResult'))
        .handler(a.handler.function('echoFunction'))
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    type ActualEcho = Schema[typeof __modelMeta__]['customOperations']['echo'];

    type Expected = {
      arguments: {
        inputContent: string;
      };
      typeName: 'Query';
      returnType: {
        resultContent?: string | null | undefined;
      } | null;
    };

    type ActualEchoInterface = Pick<ActualEcho, keyof Expected>;

    type test = Expect<Equal<ActualEchoInterface, Expected>>;

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  test('custom mutation', () => {
    const schema = a.schema({
      LikePostResult: a.customType({
        likes: a.integer().required(),
      }),
      likePost: a
        .mutation()
        .arguments({
          postId: a.string().required(),
        })
        .returns(a.ref('LikePostResult'))
        .handler(a.handler.function('likePost'))
        .authorization([a.allow.public()]),
    });

    type Schema = ClientSchema<typeof schema>;
    type ActualLikePost =
      Schema[typeof __modelMeta__]['customOperations']['likePost'];

    type Expected = {
      arguments: {
        postId: string;
      };
      typeName: 'Mutation';
      returnType: {
        likes: number;
      } | null;
    };

    type ActualLikePostInterface = Pick<ActualLikePost, keyof Expected>;

    type test = Expect<Equal<ActualLikePostInterface, Expected>>;

    const graphql = schema.transform().schema;
    expect(graphql).toMatchSnapshot();
  });

  describe('for an rds schema', () => {
    const fakeSecret = () => ({}) as any;

    const datasourceConfigMySQL = {
      engine: 'mysql',
      hostname: fakeSecret(),
      username: fakeSecret(),
      password: fakeSecret(),
      port: fakeSecret(),
      databaseName: fakeSecret(),
    } as const;

    const aSql = configure({ database: datasourceConfigMySQL });

    test('can define public auth with no provider', () => {
      const schema = aSql.schema({
        A: a
          .model({
            field: a.string(),
          })
          .authorization([a.allow.public()]),
      });

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        field?: string | null | undefined;
        // doesn't imply id field
        // doesn't imply timestamp fields
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      const graphql = schema.transform().schema;
      expect(graphql).toMatchSnapshot();
    });

    test('allows owner', () => {
      const schema = aSql
        .schema({
          A: a.model({
            field: a.string(),
          }),
        })
        .authorization([a.allow.owner()]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        field?: string | null | undefined;
        // doesn't imply id field
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(() => schema.transform().schema).toThrowError(
        "Field owner isn't defined.",
      );
    });

    test('allows id to be specified', () => {
      const schema = aSql
        .schema({
          A: a
            .model({
              idNum: a.integer().required(),
              field: a.string(),
            })
            .identifier(['idNum']),
        })
        .authorization([a.allow.owner()]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        idNum: number;
        field?: string | null | undefined;
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(() => schema.transform().schema).toThrowError(
        "Field owner isn't defined.",
      );
    });

    test('related models', () => {
      const schema = aSql
        .schema({
          B: a
            .model({
              id: a.string().required(),
              title: a.string(),
            })
            .identifier(['id']),
          A: a
            .model({
              idNum: a.integer().required(),
              field: a.string(),
              bId: a.string(),
              b: a.belongsTo('B').references(['bId']),
            })
            .identifier(['idNum']),
        })
        .authorization([a.allow.owner()]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        idNum: number;
        field?: string | null | undefined;
        bId?: string | null | undefined;
        b: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<
          | {
              id: string;
              title: Nullable<string>;
            }
          | null
          | undefined
        >;
        // doesn't imply id field
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;

      expect(() => schema.transform().schema).toThrowError(
        "Field owner isn't defined.",
      );
    });

    test('related models with missing foreign keys', () => {
      const schema = aSql
        .schema({
          B: a
            .model({
              id: a.string().required(),
              title: a.string(),
            })
            .identifier(['id']),
          A: a
            .model({
              idNum: a.integer().required(),
              field: a.string(),
              b: a.belongsTo('B').references(['bId']),
            })
            .identifier(['idNum']),
        })
        .authorization([a.allow.public()]);

      type Actual_A = Prettify<ClientSchema<typeof schema>['A']>;

      type Expected_A = {
        idNum: number;
        field?: string | null | undefined;
        b: (
          options?:
            | {
                authMode?: AuthMode | undefined;
                authToken?: string | undefined;
                headers?: CustomHeaders | undefined;
              }
            | undefined,
        ) => SingularReturnValue<
          | {
              id: string;
              title: Nullable<string>;
            }
          | null
          | undefined
        >;
        // doesn't imply id field
        // doesn't imply timestamp fields
        // doesn't imply owner field
      };

      type test = Expect<Equal<Actual_A, Expected_A>>;
    });

    describe('custom operations', () => {
      test('custom query', () => {
        const schema = aSql.schema({
          EchoResult: a.customType({
            resultContent: a.string(),
          }),
          echo: a
            .query()
            .arguments({
              inputContent: a.string().required(),
            })
            .returns(a.ref('EchoResult'))
            .handler(a.handler.function('echoFunction'))
            .authorization([a.allow.public()]),
        });

        type Schema = ClientSchema<typeof schema>;
        type ActualEcho =
          Schema[typeof __modelMeta__]['customOperations']['echo'];

        type Expected = {
          arguments: {
            inputContent: string;
          };
          typeName: 'Query';
          returnType: {
            resultContent?: string | null | undefined;
          } | null;
        };

        type ActualEchoInterface = Pick<ActualEcho, keyof Expected>;

        type test = Expect<Equal<ActualEchoInterface, Expected>>;

        const graphql = schema.transform().schema;
        expect(graphql).toMatchSnapshot();
      });
    });
  });
});
