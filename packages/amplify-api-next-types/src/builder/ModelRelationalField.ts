import { SetTypeSubArg } from './util';
import { Authorization } from './Authorization';
import {__auth} from './ModelField'

export enum ModelRelationshipTypes {
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  belongsTo = 'belongsTo',
  manyToMany = 'manyToMany',
}

type RelationshipTypes = `${ModelRelationshipTypes}`;

export type ModelRelationalFieldData = {
  fieldType: 'model';
  type: ModelRelationshipTypes;
  relatedModel: string;
  array: boolean;
  valueOptional: boolean;
  arrayOptional: boolean;
  connectionName?: string;
  authorization: Authorization<any, any>[];
};

export type ModelRelationalFieldParamShape = {
  type: 'model';
  relationshipType: string;
  relatedModel: string;
  valueOptional: boolean;
  array: boolean;
  arrayOptional: boolean;
  connectionName?: string;
};

export type ModelRelationalField<
  T extends ModelRelationalFieldParamShape,
  // RM adds structural separation with ModelField; easier to identify it when mapping to ClientTypes
  RM extends string | symbol,
  K extends keyof ModelRelationalField<T, RM> = never,
  Auth = undefined
> = Omit<
  {
    valueOptional(): ModelRelationalField<
      SetTypeSubArg<T, 'valueOptional', true>,
      K | 'valueOptional'
    >;
    arrayOptional(): ModelRelationalField<
      SetTypeSubArg<T, 'arrayOptional', true>,
      K | 'arrayOptional'
    >;
    authorization<AuthRuleType extends Authorization<any, any>>(
      rules: AuthRuleType[]
    ): ModelRelationalField<T, K | 'authorization', K, AuthRuleType>;
  },
  K
> & {
  // This is a lie. This property is never set at runtime. It's just used to smuggle auth types through.
  [__auth]?: Auth;
};

/**
 * Internal representation of Model Field that exposes the `data` property.
 * Used at buildtime.
 */
export type InternalRelationalField = ModelRelationalField<
  ModelRelationalFieldParamShape,
  string,
  never
> & {
  data: ModelRelationalFieldData;
};

export type ModelRelationalTypeArgFactory<
  RM extends string,
  RT extends RelationshipTypes,
  IsArray extends boolean,
  ConnectionName extends string | undefined = undefined
> = {
  type: 'model';
  relatedModel: RM;
  relationshipType: RT;
  array: IsArray;
  valueOptional: false;
  arrayOptional: false;
  connectionName: ConnectionName;
};


