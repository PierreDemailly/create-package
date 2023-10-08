export function clearLastLine() {
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine();
}

export function beep() {
  process.stdout.write("\x07");
  process.stdout.clearLine();
}
