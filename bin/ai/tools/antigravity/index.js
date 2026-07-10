"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntigravityTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class AntigravityTool extends base_1.BaseTool {
    constructor() {
        super('antigravity', '.');
    }
    getStrategy() {
        return new strategies_1.MultiFileStrategy((instruction) => {
            const contextId = instruction.contextId;
            return [
                new strategies_1.AddPathPrefixTransformer('.agent/rules'),
                new strategies_1.AddFilenamePrefixTransformer(`${contextId}-`),
                new strategies_1.AddFilenamePrefixTransformer(`rete-`)
            ];
        }, (instruction) => [
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]')
        ]);
    }
}
exports.AntigravityTool = AntigravityTool;
