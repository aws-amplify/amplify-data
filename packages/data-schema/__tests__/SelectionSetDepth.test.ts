import { expectTypeTestsToPassAsync } from 'jest-tsd';

it('should not produce static type errors', async () => {
  await expectTypeTestsToPassAsync(__filename);
});
