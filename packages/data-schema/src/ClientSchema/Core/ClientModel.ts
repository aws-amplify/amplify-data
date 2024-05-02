import type { ModelTypeParamShape } from '../../ModelType';
import { ClientSchemaProperty } from './ClientSchemaProperty';
import { ResolveFields } from '../utilities/ResolveField';

export interface ClientModel<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> extends ClientSchemaProperty {
  __entityType: 'model';
  type: ClientFields<Bag, T>;
  identifier: ModelIdentifier<Bag, T>;
}

type ClientFields<
  Bag extends Record<string, unknown>,
  T extends ModelTypeParamShape,
> = ResolveFields<Bag, T['fields']> & ModelIdentifier<Bag, T> & SystemFields;

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
