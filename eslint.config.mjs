import eslintJs from '@eslint/js';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig(
  eslintJs.configs.recommended,
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '**/build/',
    '**/bin/',
    '**/dist/',
    '**/obj/',
    '**/out/',
    '**/.next/',
    '**/node_modules/',
    '**/storybook-static/',
    'next-env.d.ts',
    'src/graphql/generated/**',
    'coverage/**',
  ]),
  {
    name: 'Plugins',
    plugins: {
      'unused-imports': eslintPluginUnusedImports,
      import: importPlugin,
    },
  },
  {
    name: 'Import/rules',
    rules: {
      'import/no-default-export': 'error',
    },
    files: ['src/**/*.tsx', 'src/**/*.ts'],
    ignores: ['src/**/*.tsx'],
  },
  {
    name: 'Import/exceptions',
    files: ['src/pages/**/*.page.*', 'src/**/*.stories.tsx'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    name: 'React/hooks',
    files: ['src/**/*.stories.tsx'],
    rules: {
      'import/no-default-export': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    name: 'JsFiles/rules',
    files: ['./*.config.{mjs,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  {
    name: 'storybook/rules',
    files: ['**/*.stories.@(ts|tsx|js|jsx)', '**/*.story.@(ts|tsx|js|jsx)'],
    plugins: {
      storybook: eslintPluginStorybook,
    },
    rules: {
      ...eslintPluginStorybook.configs.recommended.rules,
    },
  },
  {
    name: 'ProjectCustom/rules',
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  }
);

export default eslintConfig;
