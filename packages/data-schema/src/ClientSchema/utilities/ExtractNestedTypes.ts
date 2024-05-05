import { ClientSchemaByEntityTypeBaseShape } from '..';
import { UnionToIntersection } from '@aws-amplify/data-schema-types';

// Without renaming. Assumes name correction occurs downstream. But, this is
// probably more difficult downstream.
// export type ExtractNestedTypes<T extends ClientSchemaByEntityTypeBaseShape> =
//   UnionToIntersection<T['models'][keyof T['models']]['nestedTypes']>;

export type ExtractNestedTypes<T extends ClientSchemaByEntityTypeBaseShape> =
  UnionToIntersection<
    {
      [ModelName in keyof T['models']]: ModelName extends string
        ? {
            [TypeName in keyof T['models'][ModelName]['nestedTypes'] as TypeName extends string
              ? `${ModelName}${Capitalize<TypeName>}`
              : never]: T['models'][ModelName]['nestedTypes'][TypeName];
          }
        : never;
    }[keyof T['models']]
  >;
