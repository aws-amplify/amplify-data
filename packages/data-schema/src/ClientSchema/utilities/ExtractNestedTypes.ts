import { ClientSchemaByEntityTypeBaseShape } from '../internal';
import { UnionToIntersection } from '@aws-amplify/data-schema-types';

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
