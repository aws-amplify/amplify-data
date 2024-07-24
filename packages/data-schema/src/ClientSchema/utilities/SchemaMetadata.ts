import { ImpliedAuthFields } from '../../Authorization';
import { BaseSchema } from '../../ModelSchema';

export interface SchemaMetadata<Schema extends BaseSchema<any, any>> {
  authFields: AuthFieldsMetadata<Schema>;
}

export type AuthFieldsMetadata<Schema extends Record<string, any>> =
  Schema['data']['authorization'][number] extends never
    ? object
    : ImpliedAuthFields<Schema['data']['authorization'][number]>;
