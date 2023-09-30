// Import Node.js Dependencies
import { execSync } from "node:child_process";

// TODO: node-git
export function gitAuthor() {
  const author = {
    name: execSync("git config user.name").toString().replace(/\r?\n/, ""),
    email: execSync("git config user.email").toString().replace(/\r?\n/, "")
  };

  return author.name ? `${author.name} <${author.email}>` : "";
}

export function clearLastLine() {
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine();
}

export function beep() {
  process.stdout.write("\x07");
  process.stdout.clearLine();
}
