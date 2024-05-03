import { ClientSchemaByEntityTypeBaseShape } from '..';
import { UnionToIntersection } from '@aws-amplify/data-schema-types';

export type ExtractNestedTypes<T extends ClientSchemaByEntityTypeBaseShape> =
  UnionToIntersection<T['models'][keyof T['models']]['nestedTypes']>;
