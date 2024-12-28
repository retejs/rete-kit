"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const consts_1 = require("../../consts");
class NextBuilder {
    constructor() {
        this.name = 'Next.js';
        this.versions = [18];
        this.foundation = 'react';
    }
    async create(name, version) {
        if (version !== 18)
            throw new Error('Unsupported version');
        const createNextVersion = 14;
        await (0, execa_1.default)('npx', [`create-next-app@${createNextVersion}`, name,
            '--ts', '--src-dir', '--no-eslint', '--no-tailwind', '--app', '--import-alias', '@/*'], { stdio: 'inherit' });
        const eslintConfigName = '.eslintrc.json';
        await fs_extra_1.default.copy((0, path_1.join)(consts_1.assetsStack, 'next', eslintConfigName), (0, path_1.join)(name, eslintConfigName), { overwrite: true });
    }
    async putAssets(name) {
        const modules = (0, path_1.join)(consts_1.assetsStack, 'next', 'modules');
        const customization = (0, path_1.join)(consts_1.assetsStack, 'react', 'modules', 'vite', 'customization');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(modules, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(customization, (0, path_1.join)(src, 'customization'), {
            recursive: true,
            overwrite: true
        });
    }
    async putScript(name, path, code) {
        const scriptPath = (0, path_1.join)(name, 'src', 'rete', path);
        await fs_1.default.promises.mkdir((0, path_1.dirname)(scriptPath), { recursive: true });
        await fs_1.default.promises.writeFile(scriptPath, code);
    }
    getStaticPath() {
        return 'build';
    }
    getBuildCommand() {
        return 'build';
    }
}
exports.NextBuilder = NextBuilder;
