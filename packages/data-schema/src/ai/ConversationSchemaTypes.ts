import { InternalRef } from '../RefType';
import { capitalize } from '../runtime/utils';
import type { ConversationType, ToolDefinition } from './ConversationType';

export const createConversationField = (
  typeDef: ConversationType,
  typeName: string,
): string => {
  const { aiModel, systemPrompt, handler, tools } = typeDef;

  const args: Record<string, string> = {
    aiModel: aiModel.friendlyName,
    systemPrompt,
  };

  if (handler) {
    if (typeof handler === 'string') {
      args['functionName'] = handler;
    } else if (typeof handler.getInstance === 'function') {
      args['functionName'] = `Fn${capitalize(typeName)}`;
    }
  }

  const argsString = Object.entries(args)
    .map(([key, value]) => `${key}: "${value}"`)
    .join(', ');

  const toolsString = tools?.length
    ? `, tools: [${getConversationToolsString(tools)}]`
    : '';

  const conversationDirective = `@conversation(${argsString}${toolsString})`;

  return `${typeName}(conversationId: ID!, content: [ContentBlockInput], aiContext: AWSJSON): ConversationMessage ${conversationDirective} @aws_cognito_user_pools`;
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
  context: AWSJSON
  uiComponents: [AWSJSON]
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
}`;

const ContentBlock = `type ContentBlock {
  text: String
  document: DocumentBlock
  image: ImageBlock
  toolResult: ToolResultBlock
  toolUse: ToolUseBlock
}`;

export const conversationTypes: string[] = [
  ConversationParticipantRole,
  ConversationMessage,
  DocumentBlockSourceInput,
  DocumentBlockInput,
  ImageBlockSourceInput,
  ImageBlockInput,
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
];
