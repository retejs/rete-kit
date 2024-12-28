"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuxtBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const consts_1 = require("../../consts");
const helpers_1 = require("../vue/helpers");
class NuxtBuilder {
    constructor() {
        this.name = 'Nuxt';
        this.versions = [3];
        this.foundation = 'vue';
    }
    async create(name) {
        await (0, execa_1.default)('npx', ['nuxi@3', 'init', name, '--packageManager', 'npm', '--gitInit'], { stdio: 'inherit' });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async putAssets(name, _version, template) {
        const modules = (0, path_1.join)(consts_1.assetsStack, 'nuxt', 'modules');
        const customization = (0, path_1.join)(consts_1.assetsStack, 'vue', 'modules', 'vite', 'customization');
        const src = (0, path_1.join)(name);
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
        await (0, helpers_1.templateAssets)(src, template);
    }
    async putScript(name, path, code) {
        const scriptPath = (0, path_1.join)(name, 'rete', path);
        await fs_1.default.promises.mkdir((0, path_1.dirname)(scriptPath), { recursive: true });
        await fs_1.default.promises.writeFile(scriptPath, code);
    }
    getStaticPath() {
        return (0, path_1.join)('.output', 'public');
    }
    getBuildCommand() {
        return 'generate';
    }
}
exports.NuxtBuilder = NuxtBuilder;
