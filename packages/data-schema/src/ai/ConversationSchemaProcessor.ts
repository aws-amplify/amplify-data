import { LambdaFunctionDefinition } from "@aws-amplify/data-schema-types";
import { accessData } from '../Authorization';
import { InternalRef } from "../RefType";
import { capitalize } from "../runtime/utils";
import { InternalConversationType, ToolDefinition } from "./ConversationType";

export const createConversationField = (
  typeDef: InternalConversationType,
  typeName: string,
): { field: string, functionHandler: LambdaFunctionDefinition } => {
  const { aiModel, systemPrompt, handler, tools } = typeDef;
  const { strategy, provider } = extractAuthorization(typeDef, typeName);

  const args: Record<string, string> = {
    aiModel: aiModel.resourcePath,
    // This is done to escape newlines in potentially multi-line system prompts
    // e.g.
    // realtorChat: a.conversation({
    //   aiModel: a.ai.model('Claude 3 Haiku'),
    //   systemPrompt: `You are a helpful real estate assistant
    //   Respond in the poetic form of haiku.`,
    // }),
    //
    // It doesn't affect non multi-line string inputs for system prompts
    systemPrompt: systemPrompt.replace(/\r?\n/g, '\\n'),
  };

  const argsString = Object.entries(args)
    .map(([key, value]) => `${key}: "${value}"`)
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

  const field = `${typeName}(conversationId: ID!, content: [ContentBlockInput], aiContext: AWSJSON, toolConfiguration: ToolConfigurationInput): ConversationMessage ${conversationDirective} @aws_cognito_user_pools`;
  return { field, functionHandler };
};

const isRef = (query: unknown): query is { data: InternalRef['data'] } =>
  (query as any)?.data?.type === 'ref';

const getConversationToolsString = (tools: ToolDefinition[]) =>
  tools
    .map((tool) => {
      const { name, description } = tool;
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
        throw new Error(`Tool name must start with a letter and contain only letters, numbers, and underscores. Found: ${name}`);
      }
      const toolDefinition = extractToolDefinition(tool);
      return `{ name: "${name}", description: "${description}", ${toolDefinition} }`;
    })
    .join(', ');

const extractToolDefinition = (tool: ToolDefinition): string => {
  if ('model' in tool) {
    if (!isRef(tool.model)) throw new Error(`Unexpected model was found in tool ${tool}.`);
    const { model, operation } = tool;
    return `modelName: "${model.data.link}", modelOperation: ${operation}`;
  }

  if (!isRef(tool.query)) throw new Error(`Unexpected query was found in tool ${tool}.`);
  return `queryName: "${tool.query.data.link}"`;
};

const extractAuthorization = (typeDef: InternalConversationType, typeName: string): { strategy: string, provider: string } => {
  const { authorization } = typeDef.data;
  if (authorization.length === 0) {
    throw new Error(`Conversation ${typeName} is missing authorization rules. Use .authorization((allow) => allow.owner()) to configure authorization for your conversation route.`);
  }

  const { strategy, provider } = accessData(authorization[0]);
  if (strategy !== 'owner' || provider !== 'userPools') {
    throw new Error(`Conversation ${typeName} must use owner authorization with a user pool provider. Use .authorization((allow) => allow.owner()) to configure authorization for your conversation route.`);
  }
  return { strategy, provider };
};
