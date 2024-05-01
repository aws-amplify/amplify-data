import { EnumTypeParamShape } from '../../EnumType';
import { ClientSchemaProperty } from './ClientSchemaProperty';

export interface ClientEnum<T extends EnumTypeParamShape>
  extends ClientSchemaProperty {
  __entityType: 'enum';
  type: T['values'][number];
}
