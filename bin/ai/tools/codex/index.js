"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodexTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class CodexTool extends base_1.BaseTool {
    constructor() {
        super('codex', '.');
    }
    getStrategy() {
        return new strategies_1.SingleFileStrategy('AGENTS.md', (instruction) => [
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]')
        ]);
    }
}
exports.CodexTool = CodexTool;
