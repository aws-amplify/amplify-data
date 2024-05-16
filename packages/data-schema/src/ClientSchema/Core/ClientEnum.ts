import { ClientSchemaProperty } from './ClientSchemaProperty';

export interface ClientEnum<values extends readonly string[]>
  extends ClientSchemaProperty {
  __entityType: 'enum';
  type: values[number];
}
