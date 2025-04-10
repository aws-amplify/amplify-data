import type { Equal, Expect, Prettify } from '@aws-amplify/data-schema-types';
import { type ModelType, type InternalModel, model } from '../src/ModelType';
import { modelIndex } from '../src/ModelIndex';
import { type ModelField, string, id, integer, ModelFieldType } from '../src/ModelField';
import { ref } from '../src/RefType';

const a = { model, index: modelIndex };

type GetModelTypeArg<T> = T extends ModelType<infer R, any> ? R : never;

describe('InternalModel casting', () => {
  test('basic ModelType can be cast to InternalModel', () => {
    const m = model({
      title: string(),
    });

    // @ts-expect-error
    const data = m.data;

    const internalModel = m as InternalModel;
    internalModel.data;
  });

  test('relationships invalid at model definition', () => {
    const m = model({
      title: string(),
    });

    // @ts-expect-error
    const data = m.relationships({});
  });

  test('ModelType with options can be cast to InternalModel', () => {
    const m = model({
      title: string().required(),
      description: string(),
    }).identifier(['title']);

    // @ts-expect-error
    const data = m.data;

    const internalModel = m as InternalModel;
    internalModel.data;
  });
});

describe('identifiers', () => {
  test('model() with fields and default id produces expected type args', () => {
    const m = model({
      title: string(),
    });

    type MT = GetModelTypeArg<typeof m>;

    type ExpectedType = {
      fields: {
        title: ModelField<string | null, never, undefined, ModelFieldType.String>;
      };
      identifier: {
        pk: {
          readonly id: string;
        };
        sk: never;
        compositeSk: never;
      };
      secondaryIndexes: [];
      authorization: [];
      disabledOperations: [];
    };

    type test = Expect<Equal<MT, ExpectedType>>;
  });

  test('model() with fields and custom id produces expected type args', () => {
    const m = model({
      customId: id().required(),
    }).identifier(['customId']);

    type MT = GetModelTypeArg<typeof m>;

    type ExpectedType = {
      fields: {
        customId: ModelField<string, 'required', never, ModelFieldType.Id>;
      };
      identifier: {
        pk: {
          customId: string;
        };
        sk: never;
        compositeSk: never;
      };
      secondaryIndexes: [];
      authorization: [];
      disabledOperations: [];
    };

    type test = Expect<Equal<MT, ExpectedType>>;

    const m2 = model({
      customId: id().required(),
      title: string(),
    });

    // While allowed on schemas to facilitate SQL generated fields e.g. SERIAL,
    // improperly assignging a nullable field as an identifier will result in build errors
    m2.identifier(['title']);
  });

  test('model with fields and secondary index', () => {
    const m = a
      .model({
        title: string(),
      })
      .secondaryIndexes((index) => [index('title')]);
  });
});
