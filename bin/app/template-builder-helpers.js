"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTemplate = void 0;
const fs_1 = __importDefault(require("fs"));
class FileTemplate {
    constructor(template) {
        this.template = template;
    }
    async apply(modules, format = true) {
        for (const module of modules) {
            const file = await fs_1.default.promises.readFile(module, { encoding: 'utf-8' });
            await fs_1.default.promises.writeFile(module, await this.template.build(file, format));
        }
    }
}
exports.FileTemplate = FileTemplate;
