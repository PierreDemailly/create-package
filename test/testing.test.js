// Import Third-party Dependencies
import { vi, describe, expect, test, beforeEach } from "vitest";

// Import Internal Dependencies
import { testing } from "../src/testing.js";
import { resetProjectConfig } from "./helpers.ts";
import { projectConfig } from "../src/projectConfig.js";

function* mockPromptsValues() {
  yield true;
  yield "node:test";
  yield true;
  yield "vitest";
  yield true;
  yield "tap";
}

const mockPromptsValues$ = mockPromptsValues();

vi.mock("@topcli/prompts", () => {
  return {
    select: async() => mockPromptsValues$.next().value,
    confirm: async() => mockPromptsValues$.next().value
  };
});

describe("Test Runners", () => {
  beforeEach(() => {
    resetProjectConfig();
  });

  test("node:test", async() => {
    await testing();
    const { scripts, devDeps } = projectConfig;

    expect(scripts).toStrictEqual([
      { name: "test", value: "node --test ./test/**.test.js" }
    ]);
    expect(devDeps).toStrictEqual([]);
  });

  test("vitest", async() => {
    await testing();
    const { scripts, devDeps } = projectConfig;
    expect(scripts).toStrictEqual([
      { name: "test", value: "vitest run" },
      { name: "test:c8", value: "vitest run --coverage" }
    ]);
    expect(devDeps).toStrictEqual(["vitest", "@vitest/coverage-c8"]);
  });

  test("tap", async() => {
    await testing();
    const { scripts, devDeps } = projectConfig;

    expect(scripts).toStrictEqual([
      { name: "test", value: "tap --no-coverage ./test/**.test.js" },
      { name: "test:c8", value: "tap ./test/**.test.js" }
    ]);
    expect(devDeps).toStrictEqual(["tap"]);
  });
});
