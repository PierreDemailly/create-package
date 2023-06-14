// Import Node.js Dependencies
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Import Internal Dependencies
import { Feature } from "./feature.js";
import { gitAuthor } from "./utils.js";

// CONSTANTS
const kLicensePath = join(import.meta.url, "../assets/licenses/MIT");

export async function license() {
  const feature = new Feature();
  // TODO: maybe in the future handle multiple licenses, interactively
  feature.files.push({
    path: "LICENSE",
    content: readFileSync(fileURLToPath(kLicensePath), "utf8")
      .replace("[year]", new Date().getFullYear())
      .replace("[fullname]", gitAuthor())
  });
  feature.license = "MIT";

  return feature;
}
