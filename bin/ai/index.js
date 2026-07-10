"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolNames = getToolNames;
exports.buildInstructions = buildInstructions;
const contexts_1 = require("./contexts");
const filesystem_1 = require("./filesystem");
const guidance_1 = require("./guidance");
const logger_1 = require("./logger");
const repository_1 = require("./repository");
const tools_1 = require("./tools");
const contexts = new repository_1.Repository('context', [
    new contexts_1.OnboardContext(),
    new contexts_1.BootContext(),
    new contexts_1.DevContext(),
    new contexts_1.PluginContext()
]);
const tools = new repository_1.Repository('tool', [
    new tools_1.CursorTool(),
    new tools_1.GithubTool(),
    new tools_1.AmazonQTool(),
    new tools_1.WindsurfTool(),
    new tools_1.CodexTool(),
    new tools_1.ClaudeTool(),
    new tools_1.ContinueTool(),
    new tools_1.AntigravityTool()
]);
function getToolNames() {
    return tools.getNames();
}
function validateParameters(contextId, selectedTool, isInteractive) {
    if (!isInteractive) {
        if (!contextId) {
            throw new guidance_1.GuidanceError('No context specified');
        }
        if (!selectedTool) {
            throw new guidance_1.GuidanceError('No tool specified');
        }
    }
}
async function buildInstructions(selectedTool, contextId, force, interactive = false) {
    logger_1.logger.warn('This command is experimental. Use with caution.');
    validateParameters(contextId, selectedTool, interactive);
    const context = await contexts.select(contextId, interactive);
    const tool = await tools.select(selectedTool, interactive);
    const assets = new filesystem_1.AIAssets(process.cwd(), interactive);
    logger_1.logger.info(`Building instructions using context: "${context.getName()}"`);
    const instructionFiles = context.getInstructions();
    if (instructionFiles.length === 0) {
        logger_1.logger.warn(`No instruction files found for context "${context.getName()}", skipping...`);
        return;
    }
    // Process instructions using the tool
    await tool.apply(assets, instructionFiles, force);
    logger_1.logger.ready('Done.');
}
