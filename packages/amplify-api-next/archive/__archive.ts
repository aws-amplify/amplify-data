/* 
  Storing complicated mapped types that are no longer used but may be useful in the future
*/

// import type {
//   UnionToIntersection,
//   ExcludeEmpty,
//   ObjectIsNonEmpty,
// } from '../src/util';

// import type { ModelRelationalFieldParamShape } from '../src/ModelRelationalField';

/* 
The following 3 types allow us to dynamically generate foreign keys for relational 
models
*/

/* 
  Checks if `RelatedModel` has a HasMany relationship to `ModelName`
  We only generate FK fields for bi-directional hasOne. For HasMany relationships the existing FK is re-used to establish the relationship
  This util type lets us make that decision
*/
// type IsBidirectionalHasMany<
//   ModelName extends string,
//   RelatedModelFields
//   // If the object IS empty, that means RelatedModelFields does not have a HasMany relationship to ModelName
// > = ObjectIsNonEmpty<{
//   [Field in keyof RelatedModelFields as RelatedModelFields[Field] extends ModelRelationalFieldParamShape & {
//     relationshipType: 'hasMany';
//     relatedModel: ModelName;
//   }
//     ? Field
//     : never]: RelatedModelFields[Field];
// }>;

// type ComputedRelationalField<
//   ModelName extends string,
//   Field extends string,
//   ResolvedField,
//   IdentifierMeta extends { [modelName: string]: { identifier: string } }
// > = `${Lowercase<ModelName>}${Capitalize<Field>}${Capitalize<
//   ResolvedField extends ModelRelationalFieldParamShape
//     ? ResolvedField['relationshipType'] extends 'hasMany'
//       ? IdentifierMeta[ModelName]['identifier'] & string
//       : IdentifierMeta[ResolvedField['relatedModel']]['identifier']
//     : never
// >}`;

// type ExtractRelationalMetadata<
//   FlattenedSchema,
//   ResolvedFields,
//   IdentifierMeta
// > = UnionToIntersection<
//   ExcludeEmpty<
//     {
//       [ModelName in keyof FlattenedSchema]: {
//         [Field in keyof FlattenedSchema[ModelName] as FlattenedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
//           ? FlattenedSchema[ModelName][Field]['relationshipType'] extends 'hasMany'
//             ? // For hasMany we're adding metadata to the related model
//               // E.g. if Post hasMany Comments, we need to add a postCommentsId field to the Comment model
//               FlattenedSchema[ModelName][Field]['relatedModel']
//             : FlattenedSchema[ModelName][Field]['relationshipType'] extends 'hasOne'
//             ? // For hasOne we're adding metadata to the model itself
//               // E.g. if Post hasOne Author, we need to add a postAuthorId field to the Post model
//               ModelName
//             : // For belongsTo there are some nuances - we only add an additional field for bidirectional HasOne relationships
//             // For bi-directional HasMany, we rely on the existing generated field and don't need to add an additional one to the child model
//             FlattenedSchema[ModelName][Field]['relationshipType'] extends 'belongsTo'
//             ? FlattenedSchema[ModelName][Field]['relatedModel'] extends keyof FlattenedSchema
//               ? IsBidirectionalHasMany<
//                   ModelName & string,
//                   FlattenedSchema[FlattenedSchema[ModelName][Field]['relatedModel']]
//                 > extends false // IsBidirectionalHasMany returns false if the parent model doesn't have a hasMany relationship to ModelName
//                 ? ModelName
//                 : never
//               : never
//             : never
//           : never]: FlattenedSchema[ModelName][Field] extends ModelRelationalFieldParamShape
//           ? ModelName extends keyof ResolvedFields
//             ? {
//                 relationships: Partial<
//                   Record<
//                     ComputedRelationalField<
//                       ModelName & string,
//                       Field & string,
//                       FlattenedSchema[ModelName][Field],
//                       IdentifierMeta & {
//                         [modelName: string]: { identifier: string };
//                       }
//                     >,
//                     string
//                   >
//                 >;
//               }
//             : never
//           : never;
//       };
//     }[keyof FlattenedSchema]
//   >
// >;
