// Import Node.js Dependencies
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";
import { gitAuthor } from "./utils.js";

// CONSTANTS
const kLicensePath = join(fileURLToPath(import.meta.url), "../assets/licenses/MIT");

export async function license() {
  // TODO: maybe in the future handle multiple licenses, interactively
  projectConfig.files.push({
    path: "LICENSE",
    content: readFileSync(kLicensePath, "utf8")
      .replace("[year]", new Date().getFullYear())
      .replace("[fullname]", gitAuthor())
  });
  projectConfig.license = "MIT";
}
