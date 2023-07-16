// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export function editorConfig() {
  projectConfig.files.push({
    copy: ".editorconfig"
  });
}
