"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssets = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const inquirer_1 = require("../shared/inquirer");
const logger_1 = require("./logger");
class AIAssets {
    constructor(workingDirectory, interactive = false) {
        this.workingDirectory = workingDirectory;
        this.interactive = interactive;
    }
    getInstructionForContext(instructionFile) {
        const sourceFile = instructionFile.path; // use the path property for absolute path
        if ((0, fs_1.existsSync)(sourceFile)) {
            const content = (0, fs_1.readFileSync)(sourceFile, 'utf-8');
            return {
                path: sourceFile,
                content,
                file: instructionFile.file, // keep original filename
                contextId: instructionFile.contextId,
                title: instructionFile.title
            };
        }
        logger_1.logger.warn(`Source file ${sourceFile} not found, skipping...`);
        return null;
    }
    async handleFileOverwrite(existingFile, force) {
        if (force) {
            return true;
        }
        // In non-interactive mode, skip prompting and default to not overwriting
        if (!this.interactive) {
            logger_1.logger.warn(`Found existing file: ${existingFile}. Skipping (use --force to overwrite in non-interactive mode)`);
            return false;
        }
        logger_1.logger.warn(`Found existing file: ${existingFile}`);
        return await (0, inquirer_1.confirm)('Overwrite existing file?', false);
    }
    async copyFileWithConfirm(content, targetFile, force) {
        const relativePath = (0, path_1.relative)(this.workingDirectory, targetFile);
        if ((0, fs_1.existsSync)(targetFile)) {
            const shouldOverwrite = await this.handleFileOverwrite(relativePath, force);
            if (!shouldOverwrite) {
                logger_1.logger.skip(`Skipping ${relativePath}`);
                return;
            }
        }
        // Ensure target directory exists
        const targetDir = (0, path_1.dirname)(targetFile);
        if (!(0, fs_1.existsSync)(targetDir)) {
            (0, fs_1.mkdirSync)(targetDir, { recursive: true });
        }
        (0, fs_1.writeFileSync)(targetFile, content);
        logger_1.logger.info(`AI instructions copied to ${relativePath}`);
    }
}
exports.AIAssets = AIAssets;
