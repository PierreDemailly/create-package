#!/usr/bin/env node

// Import Node.js Dependencies
import { existsSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { EOL } from "node:os";

// Import Third-party Dependencies
import { Spinner } from "@topcli/spinner";
import { select, question, confirm, required } from "@topcli/prompts";
import { currentAuthor } from "@pierred/node-git";
import tree from "@topcli/lstree";

// Import Internal Dependencies
import { license } from "./src/license.js";
import { linter } from "./src/linter.js";
import { projectConfig } from "./src/projectConfig.js";
import { testing } from "./src/testing.js";
import { changelog } from "./src/changelog.js";
import { readme } from "./src/readme.js";
import { editorConfig } from "./src/editorConfig.js";
import { gitignore } from "./src/gitignore.js";
import { npmrc } from "./src/npmrc.js";
import { allContributors } from "./src/allcontributors.js";
import { githubActions } from "./src/githubActions.js";

const execAsync = promisify(exec);

const packageNameArg = process.argv[2];
if (packageNameArg) {
  if (existsSync(join(process.cwd(), packageNameArg))) {
    throw new Error(`Folder ${packageNameArg} already exists`);
  }
}
const packageName = packageNameArg ?? await question("Package name", {
  validators: [
    required(),
    {
      validate: (value) => !existsSync(join(process.cwd(), value)),
      error: (value) => `Folder ${value} already exists`
    }
  ]
});
const packageDesc = await question("Package description");
const module = await select("Is your project ESM or CommonJS ?", {
  choices: ["module", "commonjs"]
});
const isCLI = await confirm("Is your project a CLI ?", {
  initial: false
});

await license();
await testing();
await linter({ ESM: module === "module" });
changelog();
gitignore();
readme(packageName);
editorConfig();
await npmrc();
await allContributors(packageName);
await githubActions(projectConfig.scripts.some((script) => script.name === "test"));

const createFilesSpinner = new Spinner({ name: "line" }).start("Create project");

await mkdir(packageName);

const author = await currentAuthor();
const mainFile = isCLI ? `${packageName}.${module === "module" ? "mjs" : "js"}` : "index.js";
const packageJson = (`\
{
  "name": "${packageName}",
  "version": "0.0.1",
  "description": "${packageDesc}",
  "scripts": {
      ${projectConfig.extractScripts()}
      "pkg:ok": "npx pkg-ok"
  },
  "main": "${isCLI ? `./bin/${mainFile}` : `./${mainFile}`}",${isCLI
    ? `\n\t"bin": {
      "${packageName}": "./bin/${mainFile}"\n\t},`
    : ""}
  "keywords": [],
  "author": "${author}",
  "license": "${projectConfig.license}",
  "type": "${module}"
}`);

await writeFile(join(process.cwd(), packageName, "package.json"), packageJson);
projectConfig.createFiles(packageName);

if (isCLI) {
  await mkdir(`${packageName}/bin`);
}
const mainFilePath = join(process.cwd(), packageName, isCLI ? "./bin" : "./", mainFile);

let fileContent = "console.log(\"Hello world\")";
if (!projectConfig.devDeps.includes("standard")) {
  fileContent += ";";
}
if (isCLI) {
  fileContent = `#!/usr/bin/env node${EOL}${EOL}${fileContent}`;
}

await writeFile(mainFilePath, fileContent);

createFilesSpinner.succeed(`Project initialized: ./${packageName}`);

const lstree = tree({
  depth: 2,
  showFilesDescriptor: true,
  margin: { bottom: 1, left: 2 },
  title: `./${packageName}`
});
await lstree(join(process.cwd(), packageName));

const installSpinner = new Spinner({ name: "line" }).start("Installing dependencies");
const devDeps = [...projectConfig.devDeps, "pkg-ok"];
const deps = [...projectConfig.deps];

await execAsync(`cd ${packageName} && npm i -D ${devDeps.join(" ")}`, { stdio: [0, 1, 2] });
if (deps.length) {
  await execAsync(`cd ${packageName} && npm i ${deps.join(" ")}`, { stdio: [0, 1, 2] });
}
installSpinner.succeed("Dependencies installed");

process.exit();
