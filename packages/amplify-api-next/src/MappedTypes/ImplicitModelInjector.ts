import type {
  Prettify,
  UnionToIntersection,
  ExcludeEmpty,
} from '@aws-amplify/amplify-api-next-types-alpha';

import type {
  ModelRelationalFieldParamShape,
  ModelRelationalTypeArgFactory,
} from '../ModelRelationalField';

type ExtractImplicitModelNames<Schema> = UnionToIntersection<
  ExcludeEmpty<
    {
      [ModelProp in keyof Schema]: {
        [FieldProp in keyof Schema[ModelProp] as Schema[ModelProp][FieldProp] extends ModelRelationalFieldParamShape
          ? Schema[ModelProp][FieldProp]['relationName'] extends string
            ? Schema[ModelProp][FieldProp]['relationName'] extends keyof Schema
              ? never
              : Schema[ModelProp][FieldProp]['relationName']
            : never
          : never]: { id?: string } & Record<
          `${Lowercase<ModelProp & string>}`,
          ModelRelationalTypeArgFactory<ModelProp & string, 'hasMany', false>
        >; // implicit model will always have id: string as the PK
      };
    }[keyof Schema]
  >
>;

export type InjectImplicitModels<Schema> = Prettify<
  Schema & ExtractImplicitModelNames<Schema>
>;
