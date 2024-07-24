import { ClientSchemaPropertyType } from './ClientSchemaProperty';

export interface ClientEnum<values extends readonly string[]>
  extends ClientSchemaPropertyType {
  __entityType: 'enum';
  type: values[number];
}
