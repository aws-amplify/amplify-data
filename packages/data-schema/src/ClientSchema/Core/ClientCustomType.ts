import type { CustomTypeParamShape } from '../../CustomType';
import { ClientSchemaPropertyType } from './ClientSchemaProperty';
import { ResolveFields } from '../utilities/ResolveField';

export interface ClientCustomType<
  Bag extends Record<string, unknown>,
  T extends CustomTypeParamShape,
> extends ClientSchemaPropertyType {
  __entityType: 'customType';
  type: ResolveFields<Bag, T['fields']>;
}
