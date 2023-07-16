// Import Third-party Dependencies
import { confirm, select } from "@topcli/prompts";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

export const kEslintScript = "eslint ./**/**.js";

export async function linter(options = {}) {
  const kConfigs = ["standard", "@nodesecure/eslint-config", "eslint-config-airbnb-base"];

  if (options.ESM) {
    kConfigs.push("xo");
  }

  const config = await select("Choose linter config", {
    choices: kConfigs
  });

  if (config === "standard") {
    projectConfig.devDeps.push("standard", "snazzy");
    projectConfig.scripts.push({
      name: "lint",
      value: "standard --fix | snazzy"
    });

    const releaseItKaC = await confirm("Add @release-it/keep-a-changelog ?", {
      message: "Add @release-it/keep-a-changelog ?"
    });

    if (releaseItKaC) {
      projectConfig.devDeps.push("@release-it/keep-a-changelog");
      projectConfig.files.push({ copy: ".release-it.json" });
    }
  }
  else if (config === "xo") {
    projectConfig.devDeps.push("xo");
    projectConfig.scripts.push({ name: "lint", value: "npx xo" });
  }
  else {
    projectConfig.devDeps.push("eslint", config);
    projectConfig.scripts.push({ name: "lint", value: kEslintScript });

    const eslintrc = {
      extends: config,
      parserOptions: {
        sourceType: options.ESM ? "module" : "script",
        requireConfigFile: false
      }
    };

    projectConfig.files.push({
      path: ".eslintrc",
      content: JSON.stringify(eslintrc, null, 2)
    });
  }
}
