// Import Node.js Dependencies
import fs from "node:fs";
import path from "node:path";
import { EOL } from "node:os";
import url from "node:url";

// Import Third-party Dependencies
import { Headers, request } from "@myunisoft/httpie";
import { confirm } from "@topcli/prompts";
import { currentAuthor } from "@pierred/node-git";
import { morphix } from "@sigyn/morphix";

// Import Internal Dependencies
import { projectConfig } from "./projectConfig.js";

// CONSTANTS
const kGitHubApiUrl = "https://api.github.com";
const kRequestOptions = {
  headers: new Headers({
    "X-GitHub-Api-Version": "2022-11-28"
  })
};

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export async function allContributors(projectName, options = {}) {
  const { yes = false } = options;
  const initAllContributors = await confirm("Init all-contributors ?", {
    initial: false,
    skip: yes
  });

  if (!initAllContributors) {
    return;
  }

  const user = (await currentAuthor()).split("<")[0];

  const requestUrl = new URL(`/users/${user}`, kGitHubApiUrl);
  const { data } = await request("GET", requestUrl, kRequestOptions);

  const { login, avatar_url, name } = data;
  const template = fs.readFileSync(path.resolve(__dirname, "./assets/.all-contributorsrc"), "utf-8");
  const content = await morphix(template, { login, avatar_url, name: name ?? login, projectName });

  projectConfig.files.push({
    path: ".all-contributorsrc",
    content
  });

  const readmeTemplate = fs.readFileSync(path.resolve(__dirname, "./assets/all-contributors-readme"), "utf-8");
  const readmeContent = await morphix(readmeTemplate, { login, avatar_url, name: name ?? login, projectName });

  const configFilesReadmeIndex = projectConfig.files.findIndex((file) => file.path === "README.md");
  projectConfig.files[configFilesReadmeIndex].content += `${EOL}${EOL}${readmeContent}`;
}
