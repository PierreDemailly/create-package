// Import Node.js Dependencies
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

// Import Third-party Dependencies
import { PromptAgent } from "@topcli/prompts";

// Import Internal Dependencies
import { linter, kEslintScript } from "../src/linter.js";
import { resetProjectConfig } from "./helpers.ts";
import { projectConfig } from "../src/projectConfig.js";

// CONSTANTS
const kPromptAgent = PromptAgent.agent();

describe("Testing each test runner", () => {
  beforeEach(() => {
    resetProjectConfig();
  });

  it("eslint-config-airbnb-base", async() => {
    kPromptAgent.nextAnswer("eslint-config-airbnb-base");
    await linter();
    const { deps, devDeps, files, scripts } = projectConfig;
    assert.deepStrictEqual(deps, []);
    assert.deepStrictEqual(devDeps, ["eslint", "eslint-config-airbnb-base"]);
    assert.deepStrictEqual(files, [{
      path: ".eslintrc",
      content: JSON.stringify({
        extends: "eslint-config-airbnb-base",
        parserOptions: {
          sourceType: "script",
          requireConfigFile: false
        }
      }, null, 2)
    }]);
    assert.deepStrictEqual(scripts, [{
      name: "lint",
      value: kEslintScript
    }]);
  });

  it("eslint-config-airbnb-base ESM", async() => {
    kPromptAgent.nextAnswer("eslint-config-airbnb-base");
    await linter({ ESM: true });
    const { deps, devDeps, files, scripts } = projectConfig;
    assert.deepStrictEqual(deps, []);
    assert.deepStrictEqual(devDeps, ["eslint", "eslint-config-airbnb-base"]);
    assert.deepStrictEqual(files, [{
      path: ".eslintrc",
      content: JSON.stringify({
        extends: "eslint-config-airbnb-base",
        parserOptions: {
          sourceType: "module",
          requireConfigFile: false
        }
      }, null, 2)
    }]);
    assert.deepStrictEqual(scripts, [{
      name: "lint",
      value: kEslintScript
    }]);
  });

  it("xo", async() => {
    kPromptAgent.nextAnswer("xo");
    await linter({ ESM: true });
    const { deps, devDeps, files, scripts } = projectConfig;
    assert.deepStrictEqual(deps, []);
    assert.deepStrictEqual(devDeps, ["xo"]);
    assert.deepStrictEqual(files, []);
    assert.deepStrictEqual(scripts, [{
      name: "lint",
      value: "npx xo"
    }]);
  });

  it("standard", async() => {
    kPromptAgent.nextAnswer("standard");
    // Answer true for the "Add @release-it/keep-a-changelog ?" prompt
    kPromptAgent.nextAnswer(true);
    await linter({ ESM: true });
    const { deps, devDeps, files, scripts } = projectConfig;
    assert.deepStrictEqual(deps, []);
    assert.deepStrictEqual(devDeps, ["standard", "snazzy", "@release-it/keep-a-changelog"]);
    assert.deepStrictEqual(files, [{ copy: ".release-it.json" }]);
    assert.deepStrictEqual(scripts, [{
      name: "lint",
      value: "standard --fix | snazzy"
    }]);
  });

  it("@nodesecure/eslint-config", async() => {
    kPromptAgent.nextAnswer("@nodesecure/eslint-config");
    await linter();
    const { deps, devDeps, files, scripts } = projectConfig;
    assert.deepStrictEqual(deps, []);
    assert.deepStrictEqual(devDeps, ["eslint", "@nodesecure/eslint-config"]);
    assert.deepStrictEqual(files, [{
      path: ".eslintrc",
      content: JSON.stringify({
        extends: "@nodesecure/eslint-config",
        parserOptions: {
          sourceType: "script",
          requireConfigFile: false
        }
      }, null, 2)
    }]);
    assert.deepStrictEqual(scripts, [{
      name: "lint",
      value: kEslintScript
    }]);
  });

  it("@nodesecure/eslint-config ESM", async() => {
    kPromptAgent.nextAnswer("@nodesecure/eslint-config");
    await linter({ ESM: true });
    const { deps, devDeps, files, scripts } = projectConfig;
    assert.deepStrictEqual(deps, []);
    assert.deepStrictEqual(devDeps, ["eslint", "@nodesecure/eslint-config"]);
    assert.deepStrictEqual(files, [{
      path: ".eslintrc",
      content: JSON.stringify({
        extends: "@nodesecure/eslint-config",
        parserOptions: {
          sourceType: "module",
          requireConfigFile: false
        }
      }, null, 2)
    }]);
    assert.deepStrictEqual(scripts, [{
      name: "lint",
      value: kEslintScript
    }]);
  });
});
