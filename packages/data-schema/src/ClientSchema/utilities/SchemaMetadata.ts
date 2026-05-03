import type { ImpliedAuthFields } from '../../Authorization';
import type {
  BaseSchema,
  ClientSchemaOptions,
  DefaultSelectionSetDepth,
  SelectionSetDepthValue,
} from '../../ModelSchema';

export interface SchemaMetadata<
  Schema extends BaseSchema<any, any>,
  Options extends ClientSchemaOptions = ClientSchemaOptions,
> {
  authFields: AuthFields<Schema>;
  // Non-distributive `[T] extends [U]` so a default `Options = ClientSchemaOptions`
  // (where selectionSetDepth is optional, type `... | undefined`) falls through
  // to the default rather than producing a union with undefined.
  selectionSetDepth: [Options['selectionSetDepth']] extends [SelectionSetDepthValue]
    ? Options['selectionSetDepth']
    : DefaultSelectionSetDepth;
}

type AuthFields<Schema extends Record<string, any>> =
  Schema['data']['authorization'][number] extends never
    ? object
    : ImpliedAuthFields<Schema['data']['authorization'][number]>;
