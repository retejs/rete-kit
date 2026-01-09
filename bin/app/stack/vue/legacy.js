"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const consts_1 = require("../../consts");
const helpers_1 = require("./helpers");
class VueBuilder {
    constructor() {
        this.name = 'Vue.js';
        this.versions = [2, 3];
        this.foundation = 'vue';
    }
    async create(name, version) {
        const assets = (0, path_1.join)(consts_1.assetsStack, 'vue');
        const presetFolder = (0, path_1.join)(assets, version === 2
            ? 'vue2'
            : 'vue3');
        await (0, execa_1.default)('npx', ['--package', `@vue/cli@`, 'vue', 'create', name, '--preset', presetFolder], { stdio: 'inherit' });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async putAssets(name, _, template) {
        const assets = (0, path_1.join)(consts_1.assetsStack, 'vue', 'modules', 'legacy');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(assets, src, {
            recursive: true,
            overwrite: true
        });
        await (0, helpers_1.templateAssets)(src, template);
    }
    async putScript(name, path, code) {
        const scriptPath = (0, path_1.join)(name, 'src', 'rete', path);
        await fs_1.default.promises.mkdir((0, path_1.dirname)(scriptPath), { recursive: true });
        await fs_1.default.promises.writeFile(scriptPath, code);
    }
    getStaticPath() {
        return 'dist';
    }
    getBuildCommand() {
        return 'build';
    }
}
exports.VueBuilder = VueBuilder;
