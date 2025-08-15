import { LambdaFunctionDefinition } from '@aws-amplify/data-schema-types';
import { accessData } from '../Authorization';
import { InternalRef } from '../RefType';
import { capitalize } from '../runtime/utils';
import type {
  InternalConversationType,
  DataToolDefinition,
} from './ConversationType';

export const createConversationField = (
  typeDef: InternalConversationType,
  typeName: string,
): { field: string; functionHandler: LambdaFunctionDefinition } => {
  const { aiModel, systemPrompt, handler, tools } = typeDef;
  const { strategy, provider } = extractAuthorization(typeDef, typeName);

  const args: Record<string, string | boolean> = {
    aiModel: aiModel.resourcePath,
  };

  if (aiModel.crossRegionInference !== undefined) {
    args.crossRegionInference = aiModel.crossRegionInference;
  }

  // This is done to escape newlines in potentially multi-line system prompts
  // e.g.
  // realtorChat: a.conversation({
  //   aiModel: a.ai.model('Claude 3 Haiku'),
  //   systemPrompt: `You are a helpful real estate assistant
  //   Respond in the poetic form of haiku.`,
  // }),
  //
  // It doesn't affect non multi-line string inputs for system prompts
  args.systemPrompt = systemPrompt.replace(/\r?\n/g, '\\n');

  const argsString = Object.entries(args)
    .map(([key, value]) => typeof value === 'boolean' ? `${key}: ${value}` : `${key}: "${value}"`)
    .join(', ');

  const authString = `, auth: { strategy: ${strategy}, provider: ${provider} }`;
  const functionHandler: LambdaFunctionDefinition = {};
  let handlerString = '';
  if (handler) {
    const functionName = `Fn${capitalize(typeName)}`;
    const eventVersion = handler.eventVersion;
    handlerString = `, handler: { functionName: "${functionName}", eventVersion: "${eventVersion}" }`;
    functionHandler[functionName] = handler;
  }

  const toolsString = tools?.length
    ? `, tools: [${getConversationToolsString(tools)}]`
    : '';

  const conversationDirective = `@conversation(${argsString}${authString}${handlerString}${toolsString})`;

  const field = `${typeName}(conversationId: ID!, content: [AmplifyAIContentBlockInput], aiContext: AWSJSON, toolConfiguration: AmplifyAIToolConfigurationInput): AmplifyAIConversationMessage ${conversationDirective} @aws_cognito_user_pools`;
  return { field, functionHandler };
};

const isRef = (query: unknown): query is { data: InternalRef['data'] } =>
  (query as any)?.data?.type === 'ref';

const extractAuthorization = (
  typeDef: InternalConversationType,
  typeName: string,
): { strategy: string; provider: string } => {
  const { authorization } = typeDef.data;
  if (authorization.length === 0) {
    throw new Error(
      `Conversation ${typeName} is missing authorization rules. Use .authorization((allow) => allow.owner()) to configure authorization for your conversation route.`,
    );
  }

  const { strategy, provider } = accessData(authorization[0]);
  if (strategy !== 'owner' || provider !== 'userPools') {
    throw new Error(
      `Conversation ${typeName} must use owner authorization with a user pool provider. Use .authorization((allow) => allow.owner()) to configure authorization for your conversation route.`,
    );
  }
  return { strategy, provider };
};

const getConversationToolsString = (tools: DataToolDefinition[]) =>
  tools
    .map((tool) => {
      const { name, description } = tool;
      // https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ToolSpecification.html
      // Pattern: ^[a-zA-Z][a-zA-Z0-9_]*$
      // Length Constraints: Minimum length of 1. Maximum length of 64.
      const isValidToolName =
        /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name) &&
        name.length >= 1 &&
        name.length <= 64;

      if (!isValidToolName) {
        throw new Error(
          `Tool name must be between 1 and 64 characters, start with a letter, and contain only letters, numbers, and underscores. Found: ${name}`,
        );
      }
      const toolDefinition = extractToolDefinition(tool);
      return `{ name: "${name}", description: "${description}", ${toolDefinition} }`;
    })
    .join(', ');

const extractToolDefinition = (tool: DataToolDefinition): string => {
  if ('model' in tool) {
    if (!isRef(tool.model))
      throw new Error(`Unexpected model was found in tool ${tool}.`);
    const { model, modelOperation } = tool;
    return `modelName: "${model.data.link}", modelOperation: ${modelOperation}`;
  }

  if (!isRef(tool.query))
    throw new Error(`Unexpected query was found in tool ${tool}.`);
  return `queryName: "${tool.query.data.link}"`;
};
