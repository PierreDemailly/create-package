// Import Internal Dependencies
import { projectConfig } from "../src/projectConfig.js";

export function resetProjectConfig() {
  projectConfig.deps = [];
  projectConfig.devDeps = [];
  projectConfig.scripts = [];
  projectConfig.files = [];
}
