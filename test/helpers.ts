// Import Internal Dependencies
import { projectConfig } from "../src/projectConfig";

export function resetProjectConfig() {
  projectConfig.deps = [];
  projectConfig.devDeps = [];
  projectConfig.scripts = [];
  projectConfig.files = [];
}
