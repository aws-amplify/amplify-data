import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';

export default tseslint.config(
  {
    ignores: ['**/*.js', '**/*.d.ts', '**/dist/**', '**/node_modules/**', '**/rollup.config.mjs'],
  },
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      'import-x': importX,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
      },
    },
    rules: {
      'no-duplicate-imports': 'error',
      'no-tabs': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Test file overrides
  {
    files: [
      'packages/data-schema/__tests__/**/*.ts',
      'packages/integration-tests/**/*.ts',
      'packages/benches/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
);
