import { ClientSchema, a } from "@aws-amplify/data-schema";
import { ModelField, Nullable } from "../../../../data-schema/dist/esm/ModelField";
import { Equal, Expect } from "@aws-amplify/data-schema-types";
import { buildAmplifyConfig, expectVariables, mockedGenerateClient } from "../../utils";
import { Amplify } from "aws-amplify";

const schemaDefaultHasValue = a
	.schema({
		Todo: a.model({
			content: a.string().default('default'),
		}),
	})
	.authorization((allow) => allow.owner());

const schemaDefaultHasNoValue = a
	.schema({
		Todo: a.model({
			content: a.string().default(),
		}),
	})
	.authorization((allow) => allow.owner());

const schemaDefaultHasNoValueRequired = a
	.schema({
		Todo: a.model({
			content: a.string().default().required(),
		}),
	})
	.authorization((allow) => allow.owner());

const schemaDefaultHasValueRequired = a
	.schema({
		Todo: a.model({
			content: a.string().default('default').required(),
		}),
	})
	.authorization((allow) => allow.owner());

/**
 * Defining the behavior for fields applied with `.default()`.
 *
 * Right now there are two defined behaviors for default fields:
 * 1. `*.default(value: foo)`: GQL field is annotated with `@default(value: "foo")`
 * 2. `*.default()`: GQL field is annotated with `@default`
 * The above mappings are testd in `ModelType.test.ts`
 * Functionality and validations are handled by the `default-value-transformer` (category-api).
 *
 * So, here we assert that the two cases have identical behaviors and effects to MIS and runtime features.
 */
describe.each([
	{ caseIdentifier: "default field with value", schema: schemaDefaultHasValue, isRequired: false },
	{ caseIdentifier: "default field has no value", schema: schemaDefaultHasNoValue, isRequired: false },
	{ caseIdentifier: "required default field has no value", schema: schemaDefaultHasNoValueRequired, isRequired: true },
	{ caseIdentifier: "required default field with value", schema: schemaDefaultHasValueRequired, isRequired: true },
])('Default value fields. Given a $caseIdentifier', ({ schema, isRequired }) => {

	type Schema = ClientSchema<typeof schema>;

	test('The client schema field is nullable', () => {
		type _fieldIsNullable =
			Expect<
				Equal<
					Schema['Todo']['type']['content'],
					Nullable<string> | undefined
				>
			>;
	})

	test('the generated modelIntrospection schema is not modified', async () => {
		const { modelIntrospection } = await buildAmplifyConfig(schema);
		expect(modelIntrospection.models.Todo.fields.content)
			.toEqual(expect.objectContaining({
				name: 'content',
				isArray: false,
				isRequired: isRequired,
				attributes: []
			}));
	});

	describe('Typical CRUD operations', () => {
		beforeEach(async () => {
			Amplify.configure(await buildAmplifyConfig(schema));
		})
		afterEach(() => {
			jest.clearAllMocks();
		});

		test('Create a new Todo with no content', async () => {
			const { spy, generateClient } = mockedGenerateClient([
				{ data: { listModels: { items: [] } } },
			]);
			const client = generateClient<Schema>();
			await client.models.Todo.create({});

			// This is expected because the default values are set by resolvers
			expectVariables(spy, {
				input: {}
			})
		})

		test('Create a new Todo with content', async () => {
			const { spy, generateClient } = mockedGenerateClient([
			{ data: { listModels: { items: [] } } },
			]);

			const content = 'Lorem ipsum'
			const client = generateClient<Schema>();
			await client.models.Todo.create({content});

			expectVariables(spy, {
				input: {
					content
				}
			})
		})
	})
})
