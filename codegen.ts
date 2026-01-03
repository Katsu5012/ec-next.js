import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './graphql/schema.graphql',
  documents: ['src/**/*.{ts,tsx}', '!src/generated/**'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        // ✅ Fragment Maskingを有効化
        fragmentMasking: { unmaskFunctionName: 'readFragment' },
      },
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
