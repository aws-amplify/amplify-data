// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ClientSchemaProperty } from '../Core';

export interface ClientConversation
  extends Pick<ClientSchemaProperty, '__entityType'> {
  __entityType: 'aiConversation';
}
