// Import Third-party Dependencies
import { confirm, select } from "@topcli/prompts";

// Import Internal Dependencies
import { Feature } from "./feature.js";

export const kEslintScript = "eslint ./**/**.js";

export async function linter(options = {}) {
  const kConfigs = ["standard", "@nodesecure/eslint-config", "eslint-config-airbnb-base"];
  const feature = new Feature();

  if (options.ESM) {
    kConfigs.push("xo");
  }

  const config = await select("Choose linter config", {
    choices: kConfigs
  });

  if (config === "standard") {
    feature.devDeps.push("standard", "snazzy");
    feature.scripts.push({
      name: "lint",
      value: "standard --fix | snazzy"
    });

    const releaseItKaC = await confirm("Add @release-it/keep-a-changelog ?", {
      message: "Add @release-it/keep-a-changelog ?"
    });

    if (releaseItKaC) {
      feature.devDeps.push("@release-it/keep-a-changelog");
      feature.files.push({ copy: ".release-it.json" });
    }
  }
  else if (config === "xo") {
    feature.devDeps.push("xo");
    feature.scripts.push({ name: "lint", value: "npx xo" });
  }
  else {
    feature.devDeps.push("eslint", config);
    feature.scripts.push({ name: "lint", value: kEslintScript });

    const eslintrc = {
      extends: config,
      parserOptions: {
        sourceType: options.ESM ? "module" : "script",
        requireConfigFile: false
      }
    };

    feature.files.push({
      path: ".eslintrc",
      content: JSON.stringify(eslintrc, null, 2)
    });
  }

  return feature;
}
