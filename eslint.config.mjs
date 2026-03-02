import path from 'node:path';
import eslintJs from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintPluginStorybook from 'eslint-plugin-storybook';
import eslintPluginTailwindcss from 'eslint-plugin-tailwindcss';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import importPlugin from 'eslint-plugin-import';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig(
  eslintJs.configs.recommended,
  ...nextVitals,
  ...nextTs,
  ...eslintPluginTailwindcss.configs['flat/recommended'],
  {
    name: 'Tailwindcss/settings',
    settings: {
      tailwindcss: {
        config: path.resolve('src/styles/globals.css'),
      },
    },
  },
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
    'src/gql/**',
  ]),
  // ----- @eslint-react: React ベストプラクティスの自動検出 -----
  // スキルルール (vercel-react-best-practices, vercel-composition-patterns) の
  // 違反を自動検出するための設定。型情報を使った精度の高い検出を行う。
  {
    name: 'eslint-react/recommended-type-checked',
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ...eslintReact.configs['recommended-type-checked'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // eslint-config-next 内蔵の eslint-plugin-react との競合を解消
  eslintReact.configs['disable-conflict-eslint-plugin-react'],
  {
    name: 'SkillRules/react',
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      // rendering-conditional-render: && での条件レンダリングを禁止（ternary を強制）
      // @eslint-react/no-leaked-conditional-rendering は型情報で検出するが、
      // こちらは型情報なしでも全ての && レンダリングを検出するバックアップ
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      // rerender-memo-with-default-value: デフォルトpropsにオブジェクト/配列リテラルを禁止
      '@eslint-react/no-unstable-default-props': 'warn',
      // rerender-derived-state-no-effect: useEffect内でsetStateを直接呼ぶのを防止
      // @eslint-react 側に統一し、eslint-config-next 側の重複ルールは無効化
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'warn',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    name: 'SkillRules/custom-patterns',
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          // js-tosorted-immutable: .sort() は元の配列を変更する
          selector:
            "CallExpression[callee.property.name='sort']:not([callee.object.type='ArrayExpression'])",
          message:
            '.sort() は元の配列を変更します。.toSorted() または [...arr].sort() を使用してください。',
        },
      ],
    },
  },
  // ----- 既存の設定 -----
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
    name: 'Storybook/eslint-react-off',
    files: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
    rules: {
      // Storybook・テストファイルではhooks-extra系ルールを緩和
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
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
  },
  // prettier は最後に配置（フォーマットルールの競合を解消）
  prettier
);

export default eslintConfig;
