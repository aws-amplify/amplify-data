import { ImpliedAuthFields } from '../../Authorization';
import { BaseSchema } from '../../ModelSchema';

export interface SchemaMetadata<Schema extends BaseSchema<any, any>> {
  authFields: AuthFields<Schema>;
}

type AuthFields<Schema extends Record<string, any>> =
  Schema['data']['authorization'][number] extends never
    ? object
    : ImpliedAuthFields<Schema['data']['authorization'][number]>;
