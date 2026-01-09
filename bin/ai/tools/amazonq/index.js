"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonQTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class AmazonQTool extends base_1.BaseTool {
    constructor() {
        super('amazonq', '.amazonq');
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
exports.AmazonQTool = AmazonQTool;
