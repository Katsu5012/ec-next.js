import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links"],
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true, // Babelの代わりにSWCを使用
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    check: false, // 型チェック無効化
    reactDocgen: false, // prop types生成無効化
  },
  staticDirs: ["./public"],
};

export default config;
