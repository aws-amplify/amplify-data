export interface ClientSchemaProperty {
  __entityType:
    | 'model'
    | 'enum'
    | 'customType'
    | 'customQuery'
    | 'customMutation'
    | 'customSubscription'
    | 'customConversation'
    | 'customGeneration';
  type: any;
}
