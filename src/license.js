// Import Node.js Dependencies
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Import Internal Dependencies
import { Feature } from "./feature.js";
import { gitAuthor } from "./utils.js";

export async function license() {
  const feature = new Feature();
  // TODO: maybe in the future handle multiple licenses, interactively
  feature.files.push({
    path: "LICENSE",
    content: readFileSync(join(process.cwd(), "/src/assets/licenses/MIT"), "utf8")
      .replace("[year]", new Date().getFullYear())
      .replace("[fullname]", gitAuthor())
  });
  feature.license = "MIT";

  return feature;
}
