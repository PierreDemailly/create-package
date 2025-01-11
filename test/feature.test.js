// Import Node.js Dependencies
import { EOL } from "node:os";
import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert";
import fs from "node:fs";

// Import Internal Dependencies
import { projectConfig } from "../src/projectConfig.js";

// CONSTANTS
const kFsWriteFileSyncLogs = [];
const kMockContentFile = "# cc";

describe("projectConfig", () => {
  before(async() => {
    mock.method(fs, "readFileSync", () => kMockContentFile);
    mock.method(fs, "writeFileSync", (arg, content) => {
      kFsWriteFileSyncLogs.push(arg, content);

      return true;
    });
    mock.method(fs, "mkdirSync", () => void 0);
  });

  after(() => {
    mock.restoreAll();
  });

  it("extractScripts", () => {
    projectConfig.scripts.push({ name: "aaa", value: "bbb" }, { name: "ccc", value: "ddd" });
    const scripts = projectConfig.extractScripts();
    assert.equal(scripts, `"aaa": "bbb",${EOL}"ccc": "ddd"`);
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

