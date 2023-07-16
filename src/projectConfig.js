// Import Node.js Dependencies
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EOL } from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProjectConfig {
  constructor() {
    this.deps = [];
    this.devDeps = [];
    this.files = [];
    this.scripts = [];
  }

  createFiles(dir) {
    if (!this.files.length) {
      return;
    }

    for (const file of this.files) {
      if (file.copy) {
        const content = readFileSync(path.resolve(__dirname, `./assets/${file.copy}`));
        writeFileSync(path.join(process.cwd(), dir, file.path ?? file.copy), content);

        continue;
      }

      writeFileSync(path.join(process.cwd(), dir, file.path), file.content);
    }
  }

  extractScripts() {
    if (!this.scripts.length) {
      return EOL;
    }

    return this.scripts.map((script) => `"${script.name}": "${script.value}",`).join(EOL);
  }
}

const projectConfig = new ProjectConfig();

export { projectConfig };
