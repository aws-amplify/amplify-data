import type { DefineFunction } from '@aws-amplify/data-schema-types';

export const defineFunctionStub = (config: any) =>
  ({
    provides: undefined,
    getInstance: () => {},
  }) as unknown as DefineFunction;
