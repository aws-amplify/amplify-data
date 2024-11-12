export const CONVERSATION_SCHEMA_GRAPHQL_TYPES =
/* GraphQL */ `enum ConversationParticipantRole {
  user
  assistant
}

interface ConversationMessage {
  id: ID!
  conversationId: ID!
  associatedUserMessageId: ID
  role: ConversationParticipantRole
  content: [ContentBlock]
  aiContext: AWSJSON
  toolConfiguration: ToolConfiguration
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
  owner: String
}

input DocumentBlockSourceInput {
  bytes: String
}

input DocumentBlockInput {
  format: String!
  name: String!
  source: DocumentBlockSourceInput!
}

input ImageBlockSourceInput {
  bytes: String
}

input ImageBlockInput {
  format: String!
  source: ImageBlockSourceInput!
}

input ToolUseBlockInput {
  toolUseId: String!
  name: String!
  input: AWSJSON!
}

input ToolResultContentBlockInput {
  document: DocumentBlockInput
  image: ImageBlockInput
  json: AWSJSON
  text: String
}

input ToolResultBlockInput {
  content: [ToolResultContentBlockInput!]!
  toolUseId: String!
  status: String
}

type DocumentBlockSource {
  bytes: String
}

type DocumentBlock {
  format: String!
  name: String!
  source: DocumentBlockSource!
}

type ImageBlock {
  format: String!
  source: ImageBlockSource!
}

type ImageBlockSource {
  bytes: String
}

type ToolUseBlock {
  toolUseId: String!
  name: String!
  input: AWSJSON!
}

type ToolResultContentBlock {
  document: DocumentBlock
  image: ImageBlock
  json: AWSJSON
  text: String
}

type ToolResultBlock {
  content: [ToolResultContentBlock!]!
  toolUseId: String!
  status: String
}

type ContentBlockText {
  text: String
}

type ContentBlockImage {
  image: ImageBlock
}

type ContentBlockDocument {
  document: DocumentBlock
}

type ContentBlockToolUse {
  toolUse: ToolUseBlock
}

type ContentBlockToolResult {
  toolResult: ToolResultBlock
}

input ContentBlockInput {
  text: String
  document: DocumentBlockInput
  image: ImageBlockInput
  toolResult: ToolResultBlockInput
  toolUse: ToolUseBlockInput
}

type ContentBlock {
  text: String
  document: DocumentBlock
  image: ImageBlock
  toolResult: ToolResultBlock
  toolUse: ToolUseBlock
}

input ToolConfigurationInput {
  tools: [ToolInput]
}

input ToolInput {
  toolSpec: ToolSpecificationInput
}

input ToolSpecificationInput {
  name: String!
  description: String
  inputSchema: ToolInputSchemaInput!
}

input ToolInputSchemaInput {
  json: AWSJSON
}

type ToolConfiguration {
  tools: [Tool]
}

type Tool {
  toolSpec: ToolSpecification
}

type ToolSpecification {
  name: String!
  description: String
  inputSchema: ToolInputSchema!
}

type ToolInputSchema {
  json: AWSJSON
}

type ConversationMessageStreamPart @aws_cognito_user_pools {
  id: ID!
  owner: String
  conversationId: ID!
  associatedUserMessageId: ID!
  contentBlockIndex: Int
  contentBlockText: String
  contentBlockDeltaIndex: Int
  contentBlockToolUse: ToolUseBlock
  contentBlockDoneAtIndex: Int
  stopReason: String
  errors: [ConversationTurnError]
}

type ConversationTurnError @aws_cognito_user_pools {
  message: String!
  errorType: String!
}`;