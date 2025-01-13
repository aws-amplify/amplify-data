export const CONVERSATION_SCHEMA_GRAPHQL_TYPES =
/* GraphQL */ `enum AmplifyAIConversationParticipantRole {
  user
  assistant
}

interface AmplifyAIConversationMessage {
  id: ID!
  conversationId: ID!
  associatedUserMessageId: ID
  role: AmplifyAIConversationParticipantRole
  content: [AmplifyAIContentBlock]
  aiContext: AWSJSON
  toolConfiguration: AmplifyAIToolConfiguration
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
  owner: String
}

input AmplifyAIDocumentBlockSourceInput {
  bytes: String
}

input AmplifyAIDocumentBlockInput {
  format: String!
  name: String!
  source: AmplifyAIDocumentBlockSourceInput!
}

input AmplifyAIImageBlockSourceInput {
  bytes: String
}

input AmplifyAIImageBlockInput {
  format: String!
  source: AmplifyAIImageBlockSourceInput!
}

input AmplifyAIToolUseBlockInput {
  toolUseId: String!
  name: String!
  input: AWSJSON!
}

input AmplifyAIToolResultContentBlockInput {
  document: AmplifyAIDocumentBlockInput
  image: AmplifyAIImageBlockInput
  json: AWSJSON
  text: String
}

input AmplifyAIToolResultBlockInput {
  content: [AmplifyAIToolResultContentBlockInput!]!
  toolUseId: String!
  status: String
}

type AmplifyAIDocumentBlockSource {
  bytes: String
}

type AmplifyAIDocumentBlock {
  format: String!
  name: String!
  source: AmplifyAIDocumentBlockSource!
}

type AmplifyAIImageBlock {
  format: String!
  source: AmplifyAIImageBlockSource!
}

type AmplifyAIImageBlockSource {
  bytes: String
}

type AmplifyAIToolUseBlock {
  toolUseId: String!
  name: String!
  input: AWSJSON!
}

type AmplifyAIToolResultContentBlock {
  document: AmplifyAIDocumentBlock
  image: AmplifyAIImageBlock
  json: AWSJSON
  text: String
}

type AmplifyAIToolResultBlock {
  content: [AmplifyAIToolResultContentBlock!]!
  toolUseId: String!
  status: String
}

type AmplifyAIContentBlockText {
  text: String
}

type AmplifyAIContentBlockImage {
  image: AmplifyAIImageBlock
}

type AmplifyAIContentBlockDocument {
  document: AmplifyAIDocumentBlock
}

type AmplifyAIContentBlockToolUse {
  toolUse: AmplifyAIToolUseBlock
}

type AmplifyAIContentBlockToolResult {
  toolResult: AmplifyAIToolResultBlock
}

input AmplifyAIContentBlockInput {
  text: String
  document: AmplifyAIDocumentBlockInput
  image: AmplifyAIImageBlockInput
  toolResult: AmplifyAIToolResultBlockInput
  toolUse: AmplifyAIToolUseBlockInput
}

type AmplifyAIContentBlock {
  text: String
  document: AmplifyAIDocumentBlock
  image: AmplifyAIImageBlock
  toolResult: AmplifyAIToolResultBlock
  toolUse: AmplifyAIToolUseBlock
}

input AmplifyAIToolConfigurationInput {
  tools: [AmplifyAIToolInput]
}

input AmplifyAIToolInput {
  toolSpec: AmplifyAIToolSpecificationInput
}

input AmplifyAIToolSpecificationInput {
  name: String!
  description: String
  inputSchema: AmplifyAIToolInputSchemaInput!
}

input AmplifyAIToolInputSchemaInput {
  json: AWSJSON
}

type AmplifyAIToolConfiguration {
  tools: [AmplifyAITool]
}

type AmplifyAITool {
  toolSpec: AmplifyAIToolSpecification
}

type AmplifyAIToolSpecification {
  name: String!
  description: String
  inputSchema: AmplifyAIToolInputSchema!
}

type AmplifyAIToolInputSchema {
  json: AWSJSON
}

type AmplifyAIConversationMessageStreamPart @aws_cognito_user_pools {
  id: ID!
  owner: String
  conversationId: ID!
  associatedUserMessageId: ID!
  contentBlockIndex: Int
  contentBlockText: String
  contentBlockDeltaIndex: Int
  contentBlockToolUse: AmplifyAIToolUseBlock
  contentBlockDoneAtIndex: Int
  stopReason: String
  errors: [AmplifyAIConversationTurnError]
}

type AmplifyAIConversationTurnError @aws_cognito_user_pools {
  message: String!
  errorType: String!
}`;
