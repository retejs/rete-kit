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
        this.versions = [3, 4];
        this.foundation = 'vue';
    }
    async create(name, version) {
        const template = version === 4
            ? 'v4'
            : 'v3';
        await (0, execa_1.default)('npx', [
            'nuxi@3', 'init', name, '--template', template,
            '--packageManager', 'npm', '--gitInit'
        ], { stdio: 'inherit' });
    }
    getAppRoot(name, version) {
        return version === 4
            ? (0, path_1.join)(name, 'app')
            : name;
    }
    async putAssets(name, version, template) {
        const modules = (0, path_1.join)(consts_1.assetsStack, 'nuxt', version === 4
            ? 'modules-v4'
            : 'modules');
        const customization = (0, path_1.join)(consts_1.assetsStack, 'vue', 'modules', 'vite', 'customization');
        const src = this.getAppRoot(name, version);
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
    async putScript(name, path, code, version) {
        const reteRoot = (0, path_1.join)(this.getAppRoot(name, version), 'rete');
        const scriptPath = (0, path_1.join)(reteRoot, path);
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
