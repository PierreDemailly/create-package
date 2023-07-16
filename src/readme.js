// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export function readme(packageName) {
  projectConfig.files.push({
    path: "README.md",
    content: `# ${packageName}`
  });
}
