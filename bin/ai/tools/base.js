"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTool = void 0;
const path_1 = require("path");
class BaseTool {
    constructor(name, assetPath) {
        this.name = name;
        this.assetPath = assetPath;
    }
    getName() {
        return this.name;
    }
    getAssetPath() {
        return this.assetPath;
    }
    getStrategy() {
        return;
    }
    async apply(aiAssets, instructionFiles, force) {
        if (instructionFiles.length === 0) {
            return;
        }
        const targetDir = (0, path_1.join)(process.cwd(), this.getAssetPath());
        let instructions = instructionFiles
            .map(instructionFile => {
            return aiAssets.getInstructionForContext(instructionFile);
        })
            .filter((instruction) => instruction !== null)
            .map(instruction => ({
            content: instruction.content,
            file: instruction.file,
            contextId: instruction.contextId,
            title: instruction.title
        }));
        // Apply strategy transformation if provided
        const strategy = this.getStrategy();
        if (strategy) {
            instructions = strategy.transform(instructions);
        }
        for (const instruction of instructions) {
            const targetFile = (0, path_1.join)(targetDir, instruction.file);
            await aiAssets.copyFileWithConfirm(instruction.content, targetFile, force);
        }
    }
}
exports.BaseTool = BaseTool;
