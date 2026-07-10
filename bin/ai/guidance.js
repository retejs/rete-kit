"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidanceError = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const consts_1 = require("../consts");
const logger_1 = require("./logger");
/**
 * Loads and formats the guidance message from markdown file for terminal display.
 * Converts markdown formatting (bold, italic, code, etc.) to ANSI escape codes.
 *
 * @returns Formatted guidance text with ANSI codes, or empty string if file doesn't exist
 */
async function getGuidance() {
    var _a;
    const guidancePath = (0, path_1.join)(consts_1.assetsAI, 'guidance.md');
    try {
        const guidanceTemplate = (0, fs_1.readFileSync)(guidancePath, 'utf-8');
        /*
         * Dynamic import is used because markdown-to-ansi is an ES module.
         * When compiled to CommonJS, TypeScript transforms import() to require(),
         * which doesn't work for ES modules in Node.js 16 and 18.
         * Using Function constructor prevents TypeScript from transforming the import.
         */
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const dynamicImport = new Function('specifier', 'return import(specifier)');
        const markdownToAnsiModule = await dynamicImport('markdown-to-ansi');
        const markdownToAnsiFactory = (_a = markdownToAnsiModule.default) !== null && _a !== void 0 ? _a : markdownToAnsiModule;
        // markdown-to-ansi exports a factory function that returns a converter function
        const converter = markdownToAnsiFactory();
        // Convert markdown to ANSI-formatted terminal text (supports bold, italic, code, etc.)
        return converter(guidanceTemplate).trim();
    }
    catch (error) {
        /*
         * Fallback if guidance file doesn't exist or conversion fails
         * File not found (ENOENT) is expected and silent, other errors are logged
         */
        if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
            logger_1.logger.warn(`Failed to load guidance file: ${error.message}`);
        }
        return '';
    }
}
/**
 * Error class that stores guidance and error messages separately.
 * Used for missing parameter errors to provide helpful guidance to users and AI assistants.
 */
class GuidanceError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GuidanceError';
        this.guidance = getGuidance();
    }
}
exports.GuidanceError = GuidanceError;
