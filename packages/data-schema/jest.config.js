/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    ".test-d.ts", // don't directly execute these files. They'll be tested via their `test.ts` counterparts
    "/node_modules/",
    "utils.ts",
    "/fixtures/",
    "/MappedTypes/",
  ],
  coverageThreshold: {
		global: {
			branches: 72,
			functions: 86,
			lines: 85,
			statements: 85,
		},
	},
};
