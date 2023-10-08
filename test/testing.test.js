// Import Node.js Dependencies
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

// Import Third-party Dependencies
import { PromptAgent } from "@topcli/prompts";

// Import Internal Dependencies
import { testing } from "../src/testing.js";
import { resetProjectConfig } from "./helpers.ts";
import { projectConfig } from "../src/projectConfig.js";

// CONSTANTS
const kPromptAgent = PromptAgent.agent();

describe("Test Runners", () => {
  beforeEach(() => {
    resetProjectConfig();
  });

  it("node:test", async() => {
    kPromptAgent.nextAnswer(true);
    kPromptAgent.nextAnswer("node:test");
    await testing();
    const { scripts, devDeps } = projectConfig;

    assert.deepStrictEqual(scripts, [
      { name: "test", value: "node --test ./test/**.test.js" }
    ]);
    assert.deepStrictEqual(devDeps, []);
  });

  it("vitest", async() => {
    kPromptAgent.nextAnswer(true);
    kPromptAgent.nextAnswer("vitest");
    await testing();
    const { scripts, devDeps } = projectConfig;

    assert.deepStrictEqual(scripts, [
      { name: "test", value: "vitest run" },
      { name: "test:c8", value: "vitest run --coverage" }
    ]);
    assert.deepStrictEqual(devDeps, ["vitest", "@vitest/coverage-c8"]);
  });

  it("tap", async() => {
    kPromptAgent.nextAnswer(true);
    kPromptAgent.nextAnswer("tap");
    await testing();
    const { scripts, devDeps } = projectConfig;

    assert.deepStrictEqual(scripts, [
      { name: "test", value: "tap --no-coverage ./test/**.test.js" },
      { name: "test:c8", value: "tap ./test/**.test.js" }
    ]);
    assert.deepStrictEqual(devDeps, ["tap"]);
  });
});
