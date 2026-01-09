"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTTY = isTTY;
/**
 * Check if the current process is running in an interactive terminal (TTY)
 * @returns true if running in an interactive terminal, false otherwise
 */
function isTTY() {
    return process.stdin.isTTY && process.stdout.isTTY;
}
