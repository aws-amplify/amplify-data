import type { DefineFunction } from '@aws-amplify/data-schema-types';
import { DefineConversationHandlerFunction } from '../src/ai/ConversationType';

export const defineFunctionStub = (config: any) =>
  ({
    provides: undefined,
    getInstance: () => {},
  }) as unknown as DefineFunction;

export const defineConversationHandlerFunctionStub = (config: any) =>
  ({
    eventVersion: '1.0',
    provides: undefined,
    getInstance: () => {},
  }) as unknown as DefineConversationHandlerFunction;
