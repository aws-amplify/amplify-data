import type { CustomTypeParamShape } from '../../CustomType';
import { ClientSchemaProperty } from './ClientSchemaProperty';
import { ResolveFields } from '../utilities/ResolveField';

export interface ClientCustomType<
  Bag extends Record<string, unknown>,
  T extends CustomTypeParamShape,
> extends ClientSchemaProperty {
  __entityType: 'customType';
  type: ResolveFields<Bag, T['fields']>;
}
