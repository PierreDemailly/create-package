// Import Third-party Dependencies
import { confirm } from "@topcli/prompts";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export async function npmrc() {
  const packageLock = await confirm("Keep package-lock.json ?", { initial: false });

  if (!packageLock) {
    projectConfig.files.push({
      path: ".npmrc",
      content: "package-lock=false"
    });
  }
}
