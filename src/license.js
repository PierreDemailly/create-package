// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

// Import Third-party Dependencies
import { currentAuthor } from "@pierred/node-git";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

// CONSTANTS
const kLicensePath = path.join(url.fileURLToPath(import.meta.url), "../assets/licenses/MIT");

export async function license() {
  // TODO: maybe in the future handle multiple licenses, interactively
  projectConfig.files.push({
    path: "LICENSE",
    content: fs.readFileSync(kLicensePath, "utf8")
      .replace("[year]", new Date().getFullYear())
      .replace("[fullname]", await currentAuthor())
  });
  projectConfig.license = "MIT";
}
