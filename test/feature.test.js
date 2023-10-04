// Import Node.js Dependencies
import { EOL } from "node:os";

// Import Third-party Dependencies
import { vi, expect, test } from "vitest";

// Import Internal Dependencies
import { projectConfig } from "../src/projectConfig.js";

const writeLogs = [];

const kMockContentFile = "# cc";

vi.mock("node:fs", () => {
  const actual = vi.importActual("node:fs");

  return {
    ...actual,
    readFileSync: () => kMockContentFile,
    writeFileSync: (arg, content) => {
      writeLogs.push(arg, content);

      return true;
    },
    mkdirSync: () => void 0
  };
});

test("extractScripts", () => {
  projectConfig.scripts.push({ name: "aaa", value: "bbb" }, { name: "ccc", value: "ddd" });
  const scripts = projectConfig.extractScripts();
  expect(scripts).toStrictEqual(`"aaa": "bbb",${EOL}"ccc": "ddd",`);
});

test("createFiles", () => {
  projectConfig.files.push(
    { copy: "test.md" },
    { path: "test.xd", content: "its mocked anyway" }
  );
  projectConfig.createFiles("dir");
  expect([...writeLogs[0]].join("").slice(writeLogs[0].length - 7)).toStrictEqual("test.md");
  expect(writeLogs[1]).toStrictEqual(kMockContentFile);
});
