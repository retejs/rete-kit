"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorTool = void 0;
const strategies_1 = require("../../strategies");
const base_1 = require("../base");
class CursorTool extends base_1.BaseTool {
    constructor() {
        super('cursor', '.cursor');
    }
    getStrategy() {
        return new strategies_1.MultiFileStrategy((instruction) => {
            const contextId = instruction.contextId;
            return [
                new strategies_1.AddPathPrefixTransformer('rules'),
                new strategies_1.AddFilenamePrefixTransformer(`${contextId}-`),
                new strategies_1.AddFilenamePrefixTransformer(`rete-`),
                new strategies_1.ReplaceExtensionTransformer('.mdc')
            ];
        }, (instruction) => [
            new strategies_1.PrefixedHeadingTransformer(instruction, '[Rete.js]'),
            new strategies_1.AddYamlFrontmatterTransformer({ alwaysApply: true })
        ]);
    }
}
exports.CursorTool = CursorTool;
