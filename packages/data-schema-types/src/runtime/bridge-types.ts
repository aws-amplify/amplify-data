/* eslint-disable @typescript-eslint/no-namespace */
export declare namespace AmplifyServer {
  export interface ContextToken {
    readonly value: symbol;
  }
  export interface ContextSpec {
    readonly token: ContextToken;
  }
}

export interface AmplifyClass {
  getConfig(): Readonly<ResourcesConfig>;
}

export interface ResourcesConfig {
  API?: APIConfig;
  // truncated.
}

interface APIRestConfig {
  /**
   * Required REST endpoint, must be a valid URL string.
   */
  endpoint: string;
  /**
   * Optional region string used to sign the request with IAM credentials. If Omitted, region will be extracted from
   * the endpoint.
   *
   * @default 'us-east-1'
   */
  region?: string;
  /**
   * Optional service name string to sign the request with IAM credentials.
   *
   * @default 'execute-api'
   */
  service?: string;
}

export interface RESTProviderConfig {
  REST: Record<string, APIRestConfig>;
}
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type APIConfig = AtLeastOne<RESTProviderConfig & GraphQLProviderConfig>;

export interface GraphQLProviderConfig {
  readonly GraphQL: {
    modelIntrospection: ModelIntrospectionSchema | undefined;
  };
}

/**
 *
 * TODO: Have @aws-amplify/core import these types from here?
 *
 */

/**
 * Root model instrospection schema shape.
 *
 * Borrowed from: https://github.com/aws-amplify/samsara-cli/pull/377/commits/c08ea2c1a43f36aafe63b6d14d03f884e9c0c671#diff-21ae6faa2f22c15bb25ff9b272eaab7846c0650e2d267ab720546c19559583d0R4-R108
 */
export interface ModelIntrospectionSchema {
  version: 1;
  models: SchemaModels;
  nonModels: SchemaNonModels;
  enums: SchemaEnums;
  queries?: CustomOperations;
  mutations?: CustomOperations;
  subscriptions?: CustomOperations;
}

/**
 * Top-level Entities on a Schema
 */
export type SchemaModels = Record<string, SchemaModel>;
export type SchemaNonModels = Record<string, SchemaNonModel>;
export type SchemaEnums = Record<string, SchemaEnum>;
export type CustomOperations = Record<string, CustomOperation>;

export interface SchemaModel {
  name: string;
  attributes?: ModelAttribute[];
  fields: Fields;
  pluralName: string;
  syncable?: boolean;
  primaryKeyInfo: PrimaryKeyInfo;
}
export interface SchemaNonModel {
  name: string;
  fields: Fields;
}
export interface SchemaEnum {
  name: string;
  values: string[];
}

export interface ModelAttribute {
  type: string;
  properties?: Record<string, any>;
}

export interface SecondaryIndexAttribute {
  type: 'key';
  properties: {
    name: string;
    queryField: string;
    fields: string[];
  };
}

export interface CustomOperation {
  name: string;
  type: FieldType;
  isArray: boolean;
  isRequired: boolean;
  arguments?: CustomOperationArguments;
}

export type CustomOperationArguments = Record<string, CustomOperationArgument>;

export interface CustomOperationArgument {
  name: string;
  type: FieldType;
  isArray: boolean;
  isRequired: boolean;
  isArrayNullable?: boolean;
}

/**
 * Field Definition
 */
export type Fields = Record<string, Field>;
export interface Field {
  name: string;
  type: FieldType;
  isArray: boolean;
  isRequired: boolean;
  isReadOnly?: boolean;
  isArrayNullable?: boolean;
  attributes?: FieldAttribute[];
  association?: AssociationType;
}

export type DocumentType =
  | null
  | boolean
  | number
  | string
  | DocumentType[]
  | { [prop: string]: DocumentType };

export type GraphQLAuthMode =
  | 'apiKey'
  | 'oidc'
  | 'userPool'
  | 'iam'
  | 'lambda'
  | 'none';

export interface ModelFieldType {
  model: string;
}
export interface NonModelFieldType {
  nonModel: string;
}

export type FieldType =
  | 'ID'
  | 'String'
  | 'Int'
  | 'Float'
  | 'AWSDate'
  | 'AWSTime'
  | 'AWSDateTime'
  | 'AWSTimestamp'
  | 'AWSEmail'
  | 'AWSURL'
  | 'AWSIPAddress'
  | 'Boolean'
  | 'AWSJSON'
  | 'AWSPhone'
  | { enum: string }
  | ModelFieldType
  | NonModelFieldType;
export type FieldAttribute = ModelAttribute;

/**
 * Field-level Relationship Definitions
 */
export enum CodeGenConnectionType {
  HAS_ONE = 'HAS_ONE',
  BELONGS_TO = 'BELONGS_TO',
  HAS_MANY = 'HAS_MANY',
}
export interface AssociationBaseType {
  connectionType: CodeGenConnectionType;
}

export type AssociationHasMany = AssociationBaseType & {
  connectionType: CodeGenConnectionType.HAS_MANY;
  associatedWith: string[];
};
export type AssociationHasOne = AssociationBaseType & {
  connectionType: CodeGenConnectionType.HAS_ONE;
  associatedWith: string[];
  targetNames: string[];
};

export type AssociationBelongsTo = AssociationBaseType & {
  connectionType: CodeGenConnectionType.BELONGS_TO;
  targetNames: string[];
};
export type AssociationType =
  | AssociationHasMany
  | AssociationHasOne
  | AssociationBelongsTo;

export interface PrimaryKeyInfo {
  isCustomPrimaryKey: boolean;
  primaryKeyFieldName: string;
  sortKeyFieldNames: string[];
}

/**
 * HUB
 */

export type IListener<
  Channel extends string = AmplifyChannel | string,
  EventData extends EventDataMap = EventDataMap,
> = {
  name: string;
  callback: HubCallback<Channel, EventData>;
}[];

export interface EventDataMap {
  event: string;
  data?: unknown;
}

export interface AmplifyEventData {
  auth: any; // edited: generalized for bridge type
  [key: string]: EventDataMap;
}
export type AmplifyChannel = 'auth';

export type StopListenerCallback = () => void;

export interface HubCapsule<
  Channel extends string,
  EventData extends EventDataMap,
> {
  channel: Channel;
  payload: HubPayload<EventData>;
  source?: string;
  patternInfo?: string[];
}

export type HubCallback<
  Channel extends string = string,
  EventData extends EventDataMap = EventDataMap,
> = (capsule: HubCapsule<Channel, EventData>) => void;

export type HubPayload<EventData extends EventDataMap = EventDataMap> =
  EventData & {
    message?: string;
  };

export interface AmplifyHubCallbackMap<Channel extends AmplifyChannel> {
  auth: HubCallback<Channel>;
}
