"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContinueTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class ContinueTool extends base_1.BaseTool {
    constructor() {
        super('continue', '.continue');
    }
    getStrategy() {
        return new strategies_1.MultiFileStrategy((instruction) => {
            const contextId = instruction.contextId;
            return [
                new strategies_1.AddPathPrefixTransformer('rules'),
                new strategies_1.AddFilenamePrefixTransformer(`${contextId}-`),
                new strategies_1.AddFilenamePrefixTransformer(`rete-`)
            ];
        }, (instruction) => [
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]')
        ]);
    }
}
exports.ContinueTool = ContinueTool;
