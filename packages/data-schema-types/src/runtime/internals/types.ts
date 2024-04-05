// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AmplifyClass, GraphQLAuthMode } from '../bridge-types';
import { CustomHeaders } from '../../client-types';

/**
 * @private
 *
 * The knobs available for configuring `generateClient` internally.
 */
export type ClientGenerationParams = {
  amplify: AmplifyClass;
} & CommonPublicClientOptions;

/**
 * Common options that can be used on public `generateClient()` interfaces.
 */
export interface CommonPublicClientOptions {
  authMode?: GraphQLAuthMode;
  authToken?: string;
  headers?: CustomHeaders;
}
