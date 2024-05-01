import type { ModelTypeParamShape } from '../../ModelType';
import { ClientSchemaProperty } from './ClientSchemaProperty';
import { ResolveFields } from '../utilities/ResolveField';

export interface ClientModel<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> extends ClientSchemaProperty {
  __entityType: 'model';
  type: ResolveFields<Bag, T['fields']>;
}
