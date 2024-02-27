import type { UnionToIntersection } from '@aws-amplify/data-schema-types';
import type { CustomType, CustomTypeParamShape } from '../CustomType';
import type { EnumType, EnumTypeParamShape } from '../EnumType';
import type {
  SchemaTypes,
  ModelAndCustomTypes,
  FieldTypesOfCustomType,
} from './ResolveSchema';
import type { ModelType, ModelTypeParamShape } from '../ModelType';

export type NonModelTypesShape = {
  enums: Record<string, EnumType<any>>;
  customTypes: Record<string, any>;
};

export type ExtractNonModelTypes<Schema> = ResolveNonModelFields<
  ResolveNonModelTypes<Schema, ExtractImplicitNonModelTypes<Schema>>
>;

/**
 * Extract all implicit non-model types a `FieldName: Field` map recursively,
 * and store them in a flat map. The keys are serialized property path.
 *
 * For example, with the following schema structure:
 * ```
 * ExtractAndFlattenImplicitNonModelTypesFromFields<
 *   'Post',
 *   {
 *     content: string,
 *     status: enum(['reviewing'], ['published']),
 *     meta: customType({
 *       tag: enum(['internal', 'external']),
 *       views: number
 *     }),
 *     tag: ref('SomeExplicitEnum'),
 *   }
 * >
 * ```
 * It generates the result as:
 * ```
 * {
 *   PostStatus: enum(['reviewing'], ['published']),
 *   PostMeta: customType({
 *     tag: enum(['internal', 'external']),
 *     views: number
 *   }),
 *   PostMetaTag: enum(['internal', 'external']),
 * }
 * ```
 */
export type ExtractAndFlattenImplicitNonModelTypesFromFields<
  ParentTypeName extends string,
  Fields,
> = {
  // loop through the fields - omit the field that's not a non-model type
  [FieldProp in keyof Fields as Fields[FieldProp] extends
    | EnumType<EnumTypeParamShape>
    | CustomType<CustomTypeParamShape>
    ? FieldProp
    : never]: (
    x: NonNullable<Fields[FieldProp]> extends infer FieldType
      ? // if the filed is a enum extract it as is
        FieldType extends EnumType<EnumTypeParamShape>
        ? {
            [Key in `${ParentTypeName}${Capitalize<
              FieldProp & string
            >}`]: Fields[FieldProp];
          }
        : // if the field is a CustomType
          FieldType extends CustomType<
              infer CustomTypeShape extends CustomTypeParamShape
            >
          ? // recursively extract to the Nested CustomType, and return the
            // merge of the current CustomType and the extracted (if any)
            ExtractAndFlattenImplicitNonModelTypesFromFields<
              `${ParentTypeName}${Capitalize<FieldProp & string>}`,
              CustomTypeShape['fields']
            > & {
              [Key in `${ParentTypeName}${Capitalize<
                FieldProp & string
              >}`]: Fields[FieldProp];
            }
          : never
      : never,
  ) => void;
} extends Record<string, infer Func>
  ? Func extends (x: infer P) => void
    ? P // extract the union of all types of the `x` param used above
    : Record<never, never> // return an empty mapped object (nothing got extracted)
  : Record<never, never>; // return an empty mapped object (nothing got extracted)

/**
 * Pulls out implicit, i.e. field-level non-model types from `ModelType` and
 * `CustomType` which may contain deeply nested implicit (inline) non-model
 * types.
 */
export type ExtractImplicitNonModelTypes<
  Schema,
  Targets = ModelAndCustomTypes<SchemaTypes<Schema>>,
> = UnionToIntersection<
  {
    [Model in keyof Targets]: Targets[Model] extends CustomType<
      // if the target is a CustomType
      infer R extends CustomTypeParamShape
    >
      ? // extract nested non-model types from it, and include itself
        ExtractAndFlattenImplicitNonModelTypesFromFields<
          Capitalize<Model & string>,
          R['fields']
        > & { [key in Model]: Targets[Model] }
      : // if the target is a ModelType
        Targets[Model] extends ModelType<
            infer R extends ModelTypeParamShape,
            any
          >
        ? // extract nested non-model types from it
          ExtractAndFlattenImplicitNonModelTypesFromFields<
            Capitalize<Model & string>,
            R['fields']
          >
        : // otherwise, do nothing
          Targets[Model];
  }[keyof Targets]
>;

type ResolveNonModelTypes<
  Schema,
  Extracted,
  ResolvedSchema = SchemaTypes<Schema> & Extracted,
> = {
  enums: {
    [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends EnumType<EnumTypeParamShape>
      ? Model
      : never]: ResolvedSchema[Model] extends EnumType<
      infer R extends EnumTypeParamShape
    >
      ? R['values'][number]
      : never;
  };
  customTypes: {
    [Model in keyof ResolvedSchema as ResolvedSchema[Model] extends CustomType<CustomTypeParamShape>
      ? Model
      : never]: ResolvedSchema[Model] extends CustomType<
      infer R extends CustomTypeParamShape
    >
      ? R['fields']
      : never;
  };
};

type ResolveNonModelFields<T extends NonModelTypesShape> = {
  enums: T['enums'];
  customTypes: FieldTypesOfCustomType<T['customTypes']>;
};
