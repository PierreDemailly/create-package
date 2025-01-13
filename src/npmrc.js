// Import Third-party Dependencies
import { confirm } from "@topcli/prompts";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export async function npmrc(options = {}) {
  const { yes = false } = options;
  const packageLock = await confirm("Keep package-lock.json ?", {
    initial: false,
    skip: yes
  });

  if (!packageLock) {
    projectConfig.files.push({
      path: ".npmrc",
      content: "package-lock=false"
    });
  }
}
