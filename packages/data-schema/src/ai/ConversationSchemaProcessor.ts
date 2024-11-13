import { LambdaFunctionDefinition } from "@aws-amplify/data-schema-types";
import { InternalRef } from "../RefType";
import { capitalize } from "../runtime/utils";
import { InternalConversationType, ToolDefinition } from "./ConversationType";

export const createConversationField = (
  typeDef: InternalConversationType,
  typeName: string,
): { field: string, functionHandler: LambdaFunctionDefinition } => {
  const { aiModel, systemPrompt, handler, tools } = typeDef;

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

  const conversationDirective = `@conversation(${argsString}${handlerString}${toolsString})`;

  const field = `${typeName}(conversationId: ID!, content: [ContentBlockInput], aiContext: AWSJSON, toolConfiguration: ToolConfigurationInput): ConversationMessage ${conversationDirective} @aws_cognito_user_pools`;
  return { field, functionHandler };
};

const isRef = (query: unknown): query is { data: InternalRef['data'] } =>
  (query as any)?.data?.type === 'ref';

const getConversationToolsString = (tools: ToolDefinition[]) =>
  tools
    .map((tool) => {
      const { query, description } = tool;
      if (!isRef(query)) {
        throw new Error(`Unexpected query was found in tool ${tool}.`);
      }
      // TODO: add validation for query / auth (cup) / etc
      const queryName = query.data.link;
      return `{ name: "${queryName}", description: "${description}" }`;
    })
    .join(', ');
