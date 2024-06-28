export interface ClientSchemaProperty {
  __entityType:
    | 'model'
    | 'enum'
    | 'customType'
    | 'customQuery'
    | 'customMutation'
    | 'customSubscription'
    | 'aiConversation';
  type: any;
}
