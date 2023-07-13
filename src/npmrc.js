// Import Third-party Dependencies
import { confirm } from "@topcli/prompts";

// Import Internal Dependencies
import { Feature } from "./feature.js";

export async function npmrc() {
  const feature = new Feature();

  const packageLock = await confirm("Keep package-lock.json ?", { initial: false });

  if (!packageLock) {
    feature.files.push({
      path: ".npmrc",
      content: "package-lock=false"
    });
  }

  return feature;
}
