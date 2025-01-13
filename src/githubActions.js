// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

// Import Third-party Dependencies
import { morphix } from "@sigyn/morphix";
import { multiselect, required } from "@topcli/prompts";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

// CONSTANTS
const kGitHubActions = {
  scorecard: {
    label: "OSSF Scorecard",
    description: "Run OSSF Scorecard analysis",
    folder: "workflows"
  },
  codeql: {
    label: "CodeQL",
    description: "Run CodeQL analysis",
    folder: "workflows"
  },
  dependabot: {
    label: "Dependabot",
    description: "Automated dependency updates"
  }
};
const kTestingGithubActions = {
  "node.js": {
    label: "Node.js CI",
    description: "Run unit tests",
    folder: "workflows",
    transform: async(source, options = {}) => {
      const { yes = false } = options;
      const os = await multiselect("Choose Node.js CI OS", {
        choices: ["ubuntu-latest", "macos-latest", "windows-latest"],
        preSelectedChoices: ["ubuntu-latest"],
        validators: [required()],
        skip: yes
      });

      const nodeVersions = await multiselect("Choose Node.js CI versions", {
        choices: ["20", "22"],
        preSelectedChoices: ["22"],
        validators: [required()],
        skip: yes
      });

      return await morphix(source, {
        os: os.join(", "),
        nodeVersions: nodeVersions.join(", ")
      }, {
        // ignore ${{matrix.os}} & ${{matrix.node-version}}
        ignoreMissing: true
      });
    }
  }
};

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export async function githubActions(options = {}) {
  const { yes = false, setupUnitTests = false } = options;
  const githubActions = { ...kGitHubActions };
  if (setupUnitTests) {
    Object.assign(githubActions, kTestingGithubActions);
  }

  const defaultActions = Object.keys(githubActions).filter((gha) => gha !== "scorecard");
  const choices = yes ? defaultActions : await multiselect("Choose GitHub Actions", {
    choices: Object.entries(githubActions).map(([key, value]) => {
      return {
        value: key,
        ...value
      };
    })
  });

  for (const choice of choices) {
    const file = fs.readFileSync(path.join(__dirname, `./assets/github/${choice}.yml`), "utf-8");
    const { folder, transform } = githubActions[choice];
    const outputPath = folder ? `${folder}/${choice}.yml` : `${choice}.yml`;
    const content = transform ? await transform(file, { yes }) : file;

    projectConfig.files.push({
      path: `.github/${outputPath}`,
      content
    });
  }
}
