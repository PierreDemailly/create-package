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

// Import Internal Dependencies
import { gitAuthor } from "./src/utils.js";
import { license } from "./src/license.js";
import { linter } from "./src/linter.js";
import { Feature } from "./src/feature.js";
import { testing } from "./src/testing.js";
import { changelog } from "./src/changelog.js";
import { readme } from "./src/readme.js";
import { editorConfig } from "./src/editorConfig.js";
import { gitignore } from "./src/gitignore.js";

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
const fLicense = await license();
const fTesting = await testing();
const fLinter = await linter({ ESM: module === "module" });
const fChangelog = changelog();
const fGitignore = gitignore();
const fReadme = readme(packageName);
const fEditorConfig = editorConfig();

const createFilesSpinner = new Spinner({ name: "line" }).start("Create project");

await mkdir(packageName);

const author = gitAuthor();
const mainFile = isCLI ? `${packageName}.${module === "module" ? "mjs" : "js"}` : "index.js";
const packageJson = (`\
{
  "name": "${packageName}",
  "version": "0.0.1",
  "description": "${packageDesc}",
  "scripts": {
      ${fTesting.extractScripts()}
      ${fLinter.extractScripts()}
      "pkg:ok": "npx pkg-ok"
  },
  "main": "${isCLI ? `./bin/${mainFile}` : `./${mainFile}`}",${isCLI
    ? `\n\t"bin": {
      "${packageName}": "./bin/${mainFile}"\n\t},`
    : ""}
  "keywords": [],
  "author": "${author}",
  "license": "${fLicense.license}",
  "type": "${module}"
}`);

await writeFile(join(process.cwd(), packageName, "package.json"), packageJson);
fTesting.createFiles(packageName);
fLinter.createFiles(packageName);
fLicense.createFiles(packageName);
fChangelog.createFiles(packageName);
fGitignore.createFiles(packageName);
fReadme.createFiles(packageName);
fEditorConfig.createFiles(packageName);

if (isCLI) {
  await mkdir(`${packageName}/bin`);
}
const mainFilePath = join(process.cwd(), packageName, isCLI ? "./bin" : "./", mainFile);

let fileContent = "console.log(\"Hello world\")";
if (!fLinter.devDeps.includes("standard")) {
  fileContent += ";";
}
if (isCLI) {
  fileContent = `#!/usr/bin/env node${EOL}${EOL}${fileContent}`;
}

await writeFile(mainFilePath, isCLI);

createFilesSpinner.succeed(`Project initialized: ./${packageName}`);

const features = Feature.mergeAll();
const installSpinner = new Spinner({ name: "line" }).start("Installing dependencies");
const devDeps = [...features.devDeps, "pkg-ok"];
const deps = [...features.deps];

await execAsync(`cd ${packageName} && npm i -D ${devDeps.join(" ")}`);
if (deps.length) {
  await execAsync(`cd ${packageName} && npm i ${deps.join(" ")}`);
}
installSpinner.succeed("Dependencies installed");

process.exit();
