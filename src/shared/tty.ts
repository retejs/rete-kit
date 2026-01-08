/**
 * Check if the current process is running in an interactive terminal (TTY)
 * @returns true if running in an interactive terminal, false otherwise
 */
export function isTTY(): boolean {
  return process.stdin.isTTY && process.stdout.isTTY
}
