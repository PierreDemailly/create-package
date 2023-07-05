// Import Node.js Dependencies
import { EOL } from "node:os";

// Import Third-party Dependencies
import { vi, expect, test } from "vitest";

// Import Internal Dependencies
import { Feature } from "../src/feature.js";

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
    }
  };
});

test("mergeAll", () => {
  const a = new Feature();
  a.scripts.push("a");
  a.deps.push("a");
  const b = new Feature();
  b.scripts.push("b");
  b.deps.push("b");

  const merged = Feature.mergeAll();
  expect(merged.scripts).toStrictEqual(["a", "b"]);
  expect(merged.deps).toStrictEqual(["a", "b"]);
});

test("extractScripts", () => {
  const feature = new Feature();
  feature.scripts.push({ name: "aaa", value: "bbb" }, { name: "ccc", value: "ddd" });
  const scripts = feature.extractScripts();
  expect(scripts).toStrictEqual(`"aaa": "bbb",${EOL}"ccc": "ddd",`);
});

test("createFiles", () => {
  const feature = new Feature();
  feature.files.push(
    { copy: "test.md" },
    { path: "test.xd", content: "its mocked anyway" }
  );
  feature.createFiles("dir");
  expect([...writeLogs[0]].join("").slice(writeLogs[0].length - 7)).toStrictEqual("test.md");
  expect(writeLogs[1]).toStrictEqual(kMockContentFile);
});
