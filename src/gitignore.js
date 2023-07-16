// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export function gitignore() {
  projectConfig.files.push({
    copy: "gitignore",
    path: ".gitignore"
  });
}
