import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { beforeAll, afterEach, afterAll, beforeEach } from "vitest";
import { server } from "../mocks/server";

// src/test/setup.ts
import { vi } from "vitest";

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  })),
}));

// MSW server setup
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// 各テスト前にクリーンアップ（前のテストの影響を排除）
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  server.resetHandlers();
});

// すべてのテスト後にMSW serverをクリーンアップ
afterAll(() => {
  server.close();
});
