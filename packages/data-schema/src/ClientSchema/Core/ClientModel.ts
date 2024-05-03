import type { ModelTypeParamShape } from '../../ModelType';
import { ClientSchemaProperty } from './ClientSchemaProperty';
import { ResolveFields } from '../utilities/ResolveField';
import { Authorization, ImpliedAuthFields } from '../../Authorization';
import { SchemaMetadata } from '../utilities/SchemaMetadata';
import { UnionToIntersection } from '@aws-amplify/data-schema-types';
import { ModelField } from '../../ModelField';
import { ModelRelationalField } from '../../ModelRelationalField';
import { RefType } from '../../RefType';

export interface ClientModel<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  T extends ModelTypeParamShape,
> extends ClientSchemaProperty {
  __entityType: 'model';
  type: ClientFields<Bag, Metadata, T>;
  identifier: ModelIdentifier<Bag, T>;
}

type ClientFields<
  Bag extends Record<string, unknown>,
  Metadata extends SchemaMetadata<any>,
  T extends ModelTypeParamShape,
> = ResolveFields<Bag, T['fields']> &
  ModelIdentifier<Bag, T> &
  AuthFields<Metadata, T> &
  SystemFields;

type SystemFields = {
  readonly createdAt: string;
  readonly updatedAt: string;
};

type ModelIdentifier<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> = T['identifier'][number] extends keyof T['fields']
  ? Pick<ResolveFields<Bag, T['fields']>, T['identifier'][number]>
  : { id: string };

type AuthFields<
  Metadata extends SchemaMetadata<any>,
  Model extends ModelTypeParamShape,
> = (Model['authorization'][number] extends never
  ? Metadata['authFields'] extends never
    ? object
    : Metadata['authFields']
  : ImpliedAuthFields<Model['authorization'][number]> extends never
    ? object
    : ImpliedAuthFields<Model['authorization'][number]>) &
  ImpliedAuthFieldsFromFields<Model>;

type ImpliedAuthFieldsFromFields<T> = UnionToIntersection<
  T extends ModelTypeParamShape
    ? T['fields'][keyof T['fields']] extends
        | ModelField<any, any, infer Auth>
        | ModelRelationalField<any, any, any, infer Auth>
        | RefType<any, any, infer Auth>
      ? Auth extends Authorization<any, any, any>
        ? ImpliedAuthFields<Auth>
        : object
      : object
    : object
>;
