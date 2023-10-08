// Import Node.js Dependencies
import { EOL } from "node:os";
import { describe, it, before } from "node:test";
import assert from "node:assert";

// Import Third-party Dependencies
import esmock from "esmock";

// CONSTANTS
const kFsWriteFileSyncLogs = [];
const kMockContentFile = "# cc";

describe("projectConfig", () => {
  let projectConfig;

  before(async() => {
    const module = await esmock("../src/projectConfig.js", {
      "node:fs": {
        readFileSync: () => kMockContentFile,
        writeFileSync: (arg, content) => {
          kFsWriteFileSyncLogs.push(arg, content);

          return true;
        },
        mkdirSync: () => void 0
      }
    });

    projectConfig = module.projectConfig;
  });

  it("extractScripts", () => {
    projectConfig.scripts.push({ name: "aaa", value: "bbb" }, { name: "ccc", value: "ddd" });
    const scripts = projectConfig.extractScripts();
    assert.equal(scripts, `"aaa": "bbb",${EOL}"ccc": "ddd",`);
  });

  it("createFiles", () => {
    projectConfig.files.push(
      { copy: "test.md" },
      { path: "test.xd", content: "its mocked anyway" }
    );
    projectConfig.createFiles("dir");
    assert.equal([...kFsWriteFileSyncLogs[0]].join("").slice(kFsWriteFileSyncLogs[0].length - 7), "test.md");
    assert.equal(kFsWriteFileSyncLogs[1], kMockContentFile);
  });
});

