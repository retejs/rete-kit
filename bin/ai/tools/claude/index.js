"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class ClaudeTool extends base_1.BaseTool {
    constructor() {
        super('claude', '.');
    }
    getStrategy() {
        return new strategies_1.SingleFileStrategy('CLAUDE.md', (instruction) => [
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]')
        ]);
    }
}
exports.ClaudeTool = ClaudeTool;
