// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**'],
    ...playwright.configs['flat/recommended'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-skipped-test': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
];
