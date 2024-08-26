// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
  ModelAttribute,
  SchemaModel,
  SecondaryIndexAttribute,
  ModelIntrospectionSchema,
} from '../bridge-types';
import { graphQLOperationsInfo } from './APIClient';

const attributeIsSecondaryIndex = (
  attr: ModelAttribute,
): attr is SecondaryIndexAttribute => {
  return (
    attr.type === 'key' &&
    // presence of `name` property distinguishes GSI from primary index
    attr.properties?.name &&
    attr.properties?.queryField &&
    attr.properties?.fields.length > 0
  );
};

export const getSecondaryIndexesFromSchemaModel = (model: SchemaModel) => {
  const idxs = model.attributes
    ?.filter(attributeIsSecondaryIndex)
    .map((attr: SecondaryIndexAttribute) => {
      const queryField: string = attr.properties.queryField;
      const [pk, ...sk] = attr.properties.fields;

      return {
        queryField,
        pk,
        sk,
      };
    });

  return idxs || [];
};

/**
 *
 */
export const excludeDisabledOps = (
  mis: ModelIntrospectionSchema,
  modelName: string,
) => {
  /* Example model attributes in MIS 
  {
    "type": "model",
    "properties": {
      "subscriptions": null,
      "mutations": {
        "delete": null
      }
    }
  }
  */
  const modelAttrs = mis.models[modelName].attributes?.find(
    (attr) => attr.type === 'model',
  );

  const coarseToFineDict: Record<string, string[]> = {
    queries: ['list', 'get', 'observeQuery'],
    mutations: ['create', 'update', 'delete'],
    subscriptions: ['onCreate', 'onUpdate', 'onDelete'],
  };

  const disabledOps: string[] = [];

  if (!modelAttrs) {
    return graphQLOperationsInfo;
  }

  if (modelAttrs.properties) {
    for (const [key, value] of Object.entries(modelAttrs.properties)) {
      if (value === null) {
        // coarse-grained disable, e.g. "subscriptions": null,
        disabledOps.push(...coarseToFineDict[key]);
      } else if (value instanceof Object) {
        // fine-grained, e.g. "mutations": { "delete": null }
        disabledOps.push(...Object.keys(value));

        // observeQuery only exists on the client side. It's unusable without `list`
        if ('list' in Object.keys(value)) {
          disabledOps.push('observeQuery');
        }
      }
    }
  }

  const disabledOpsUpper = disabledOps.map((op) => op.toUpperCase());

  return Object.fromEntries(
    Object.entries(graphQLOperationsInfo).filter(
      ([key]) => !disabledOpsUpper.includes(key),
    ),
  );
};
