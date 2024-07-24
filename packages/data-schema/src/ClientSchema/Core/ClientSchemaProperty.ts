export interface ClientSchemaPropertyType {
  __entityType:
    | 'model'
    | 'enum'
    | 'customType'
    | 'customQuery'
    | 'customMutation'
    | 'customSubscription';
  type: any;
}
