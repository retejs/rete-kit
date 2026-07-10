"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindsurfTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class WindsurfTool extends base_1.BaseTool {
    constructor() {
        super('windsurf', '.windsurf');
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
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]'),
            new strategies_1.AddYamlFrontmatterTransformer({ trigger: 'always_on' })
        ]);
    }
}
exports.WindsurfTool = WindsurfTool;
