import type { Equal, Expect } from '@aws-amplify/data-schema-types';
import { type ModelType, type InternalModel, model } from '../src/ModelType';
import { modelIndex } from '../src/ModelIndex';
import {
  type ModelField,
  type InternalField,
  string,
  id,
} from '../src/ModelField';

const a = { model, index: modelIndex };

type GetModelTypeArg<T> = T extends ModelType<infer R, any, any> ? R : never;

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

  test('addRelationships invalid at model definition', () => {
    const m = model({
      title: string(),
    });

    // @ts-expect-error
    const data = m.addRelationships({});
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
        // id: ModelField<string>;
        title: ModelField<string | null>;
      };
      identifier: Array<'id'>;
      secondaryIndexes: [];
      authorization: [];
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
        customId: ModelField<string, 'required'>;
      };
      identifier: Array<'customId'>;
      secondaryIndexes: [];
      authorization: [];
    };

    type test = Expect<Equal<MT, ExpectedType>>;

    const m2 = model({
      customId: id().required(),
      title: string(),
    });

    // optional fields can't be used as identifier
    // @ts-expect-error
    m2.identifier(['title']);
  });

  test('model with fields and secondary index', () => {
    const m = a
      .model({
        title: string(),
      })
      .secondaryIndexes([a.index('title')]);
  });
});
