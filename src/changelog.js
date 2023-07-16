// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export function changelog() {
  projectConfig.files.push({
    copy: "CHANGELOG.md"
  });
}
