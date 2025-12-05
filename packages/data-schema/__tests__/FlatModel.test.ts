/**
 * Runtime tests for FlatModel type infrastructure.
 * Type-level tests are in FlatModel.test-d.ts
 */
import { expectTypeTestsToPassAsync } from 'jest-tsd';
import path from 'path';

describe('FlatModel type tests', () => {
  it('should pass all type-level tests', async () => {
    await expectTypeTestsToPassAsync(
      path.resolve(__dirname, 'FlatModel.test-d.ts'),
    );
  });
});
