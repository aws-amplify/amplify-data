// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  BaseClient,
  ClientInternalsGetter,
  ModelIntrospectionSchema,
  SchemaModel,
} from '../../bridge-types';
import { getFactory } from '../operations/get';
import { listFactory } from '../operations/list';
import { StartSessionInput } from '../../../ai/ConversationType';

export const getSessionModelInstance = async (
  input: StartSessionInput = {},
  client: BaseClient,
  modelIntrospection: ModelIntrospectionSchema,
  sessionModel: SchemaModel,
  getInternals: ClientInternalsGetter,
) => {
  // list session models and filter by id or name
  const { id, name } = input;
  const filter = {
    or: [{ name: { eq: name ?? null } }, { id: { eq: id ?? null } }],
  };
  const list = listFactory(
    client,
    modelIntrospection,
    sessionModel,
    getInternals,
  ) as (args?: Record<string, any>) => Promise<any>;
  const { data } = await list({ filter });

  // if requested model instance already exists, return it
  if (data.length) {
    return data[0];
  }

  // otherwise, create one and return that
  const { data: newSession } = await (
    getFactory(
      client,
      modelIntrospection,
      sessionModel,
      'CREATE',
      getInternals,
    ) as (args: any) => Promise<any>
  )({ name });

  return newSession;
};
