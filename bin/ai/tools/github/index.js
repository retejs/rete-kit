"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class GithubTool extends base_1.BaseTool {
    constructor() {
        super('github', '.github');
    }
    getStrategy() {
        return new strategies_1.SingleFileStrategy('copilot-instructions.md', (instruction) => [
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]')
        ]);
    }
}
exports.GithubTool = GithubTool;
