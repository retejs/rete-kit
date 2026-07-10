"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateBuilder = exports.entryScriptPath = exports.templatesPath = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const case_1 = __importDefault(require("case"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const prettier_1 = __importDefault(require("prettier"));
const consts_1 = require("../consts");
exports.templatesPath = (0, path_1.join)(consts_1.assets, 'app', 'templates');
exports.entryScriptPath = (0, path_1.join)(consts_1.assets, 'app', 'entry_ts');
function toCreateEditorName(id) {
    return `create${case_1.default.pascal(id)}Editor`;
}
class TemplateBuilder {
    constructor(keys) {
        this.keys = keys;
        this.blockCommentRegex = /\/\* \[(!?[\w-]+)\][\r\n ]+(.*?)?[\r\n ]?\[\/\1\] \*\//gs;
    }
    normalizeLineEndings(code) {
        return code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }
    async load(name) {
        return this.normalizeLineEndings(await fs_1.default.promises.readFile((0, path_1.join)(exports.templatesPath, name), { encoding: 'utf-8' }));
    }
    static getTemplates() {
        return fs_1.default.promises.readdir(exports.templatesPath);
    }
    replace(code, keep) {
        return code.replace(this.blockCommentRegex, (_substring, key, content) => {
            if (keep(key))
                return this.replace(content, keep);
            if (key.startsWith('!') && !keep(key.split('!')[1]))
                return this.replace(content, keep);
            return '';
        });
    }
    build(template, format = true) {
        const keep = (key) => this.keys.includes(key);
        const code = this.replace(this.normalizeLineEndings(template), keep);
        return format
            ? prettier_1.default.format(code, { singleQuote: true, parser: 'typescript' })
            : code;
    }
    async getEntryScript(templateIds = []) {
        const template = this.normalizeLineEndings(await fs_1.default.promises.readFile(exports.entryScriptPath, { encoding: 'utf-8' }));
        const imports = templateIds
            .map(id => `import { createEditor as ${toCreateEditorName(id)} } from './${id}'`)
            .join('\n');
        const factoryEntries = templateIds
            .map(id => `  ,'${id}': ${toCreateEditorName(id)}`)
            .join('\n');
        return template
            .replace('/* {{virtual-imports}} */', imports)
            .replace('/* {{virtual-factory}} */', factoryEntries);
    }
}
exports.TemplateBuilder = TemplateBuilder;
