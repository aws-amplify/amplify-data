import { LambdaFunctionDefinition } from '@aws-amplify/data-schema-types';
import { InternalRef } from '../RefType';
import { capitalize } from '../runtime/utils';
import type {
  InternalConversationType,
  ToolDefinition,
} from './ConversationType';

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

const ConversationParticipantRole = `enum ConversationParticipantRole {
  user
  assistant
}`;

const ConversationMessage = `interface ConversationMessage {
  id: ID!
  conversationId: ID!
  role: ConversationParticipantRole
  content: [ContentBlock]
  aiContext: AWSJSON
  toolConfiguration: ToolConfiguration
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
  owner: String
}`;

const DocumentBlockSourceInput = `input DocumentBlockSourceInput {
  bytes: String
}`;

const DocumentBlockInput = `input DocumentBlockInput {
  format: String!
  name: String!
  source: DocumentBlockSourceInput!
}`;

const ImageBlockSourceInput = `input ImageBlockSourceInput {
  bytes: String
}`;

const ImageBlockInput = `input ImageBlockInput {
  format: String!
  source: ImageBlockSourceInput!
}`;

const ToolResultContentBlockInput = `input ToolResultContentBlockInput {
  document: DocumentBlockInput
  image: ImageBlockInput
  json: AWSJSON
  text: String
}`;

const ToolResultBlockInput = `input ToolResultBlockInput {
  content: [ToolResultContentBlockInput!]!
  toolUseId: String!
  status: String
}`;

const DocumentBlockSource = `type DocumentBlockSource {
  bytes: String
}
`;
const DocumentBlock = `type DocumentBlock {
  format: String!
  name: String!
  source: DocumentBlockSource!
}`;

const ImageBlock = `type ImageBlock {
  format: String!
  source: ImageBlockSource!
}`;

const ImageBlockSource = `type ImageBlockSource {
  bytes: String
}`;

const ToolUseBlockInput = `input ToolUseBlockInput {
  toolUseId: String!
  name: String!
  input: AWSJSON!
}`;

const ToolUseBlock = `type ToolUseBlock {
  toolUseId: String!
  name: String!
  input: AWSJSON!
}`;

const ToolResultContentBlock = `type ToolResultContentBlock {
  document: DocumentBlock
  image: ImageBlock
  json: AWSJSON
  text: String
}`;

const ToolResultBlock = `type ToolResultBlock {
  content: [ToolResultContentBlock!]!
  toolUseId: String!
  status: String
}`;

const ContentBlockText = `type ContentBlockText {
  text: String
}`;

const ContentBlockImage = `type ContentBlockImage {
  image: ImageBlock
}`;

const ContentBlockDocument = `type ContentBlockDocument {
  document: DocumentBlock
}`;

const ContentBlockToolUse = `type ContentBlockToolUse {
  toolUse: ToolUseBlock
}`;

const ContentBlockToolResult = `type ContentBlockToolResult {
  toolResult: ToolResultBlock
}`;

const ContentBlockInput = `input ContentBlockInput {
  text: String
  document: DocumentBlockInput
  image: ImageBlockInput
  toolResult: ToolResultBlockInput
  toolUse: ToolUseBlockInput
}`;

const ContentBlock = `type ContentBlock {
  text: String
  document: DocumentBlock
  image: ImageBlock
  toolResult: ToolResultBlock
  toolUse: ToolUseBlock
}`;

const ToolConfigurationInput = `input ToolConfigurationInput {
  tools: [ToolInput]
}`;

const ToolInput = `input ToolInput {
  toolSpec: ToolSpecificationInput
}`;

const ToolSpecificationInput = `input ToolSpecificationInput {
  name: String!
  description: String
  inputSchema: ToolInputSchemaInput!
}`;

const ToolInputSchemaInput = `input ToolInputSchemaInput {
  json: AWSJSON
}`;

const ToolConfiguration = `type ToolConfiguration {
  tools: [Tool]
}`;

const Tool = `type Tool {
  toolSpec: ToolSpecification
}`;

const ToolSpecification = `type ToolSpecification {
  name: String!
  description: String
  inputSchema: ToolInputSchema!
}`;

const ToolInputSchema = `type ToolInputSchema {
  json: AWSJSON
}`;

const ConversationMessageStreamEvent = `type ConversationMessageStreamPart @aws_cognito_user_pools {
  id: ID!
  owner: String
  conversationId: ID!
  associatedUserMessageId: ID!
  contentBlockIndex: Int!
  contentBlockText: String
  contentBlockDeltaIndex: Int
  contentBlockToolUse: ToolUseBlock
  contentBlockDoneAtIndex: Int
  stopReason: String
  errors: [ConversationTurnError]
}`;

const ConversationTurnError = `type ConversationTurnError @aws_cognito_user_pools {
  message: String!
  errorType: String!
}`;

export const conversationTypes: string[] = [
  ConversationParticipantRole,
  ConversationMessage,
  DocumentBlockSourceInput,
  DocumentBlockInput,
  ImageBlockSourceInput,
  ImageBlockInput,
  ToolUseBlockInput,
  ToolResultContentBlockInput,
  ToolResultBlockInput,
  DocumentBlockSource,
  DocumentBlock,
  ImageBlock,
  ImageBlockSource,
  ToolUseBlock,
  ToolResultContentBlock,
  ToolResultBlock,
  ContentBlockText,
  ContentBlockImage,
  ContentBlockDocument,
  ContentBlockToolUse,
  ContentBlockToolResult,
  ContentBlockInput,
  ContentBlock,
  ToolConfigurationInput,
  ToolInput,
  ToolSpecificationInput,
  ToolInputSchemaInput,
  ToolConfiguration,
  Tool,
  ToolSpecification,
  ToolInputSchema,
  ConversationMessageStreamEvent,
  ConversationTurnError,
];
