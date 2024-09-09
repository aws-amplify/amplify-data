// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { expectTypeTestsToPassAsync } from 'jest-tsd';

// evaluates type defs in corresponding test-d.ts file
it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});
