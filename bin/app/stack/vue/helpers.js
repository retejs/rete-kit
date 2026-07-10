"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateAssets = templateAssets;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
async function templateAssets(src, template) {
    const customNodePath = (0, path_1.join)(src, 'customization', 'CustomNode.vue');
    const customNodeContent = await fs_1.default.promises.readFile(customNodePath, { encoding: 'utf-8' });
    await fs_1.default.promises.writeFile(customNodePath, await template.build(customNodeContent, false));
}
