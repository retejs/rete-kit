"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueViteBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const ts_config_1 = require("../../../shared/ts-config");
const consts_1 = require("../../consts");
const helpers_1 = require("./helpers");
class VueViteBuilder {
    constructor() {
        this.name = 'Vue.js Vite';
        this.versions = [2, 3];
        this.foundation = 'vue';
    }
    async create(name, version) {
        await (0, execa_1.default)('npm', ['create', `vue@${version}`, name, '--', '--ts'], { stdio: 'inherit' });
        await (0, execa_1.default)('npm', ['i'], { stdio: 'inherit', cwd: name });
        const configName = version === 3
            ? 'tsconfig.app.json'
            : 'tsconfig.json';
        const tsConfig = await (0, ts_config_1.getTSConfig)(name, configName);
        tsConfig.compilerOptions.allowJs = true;
        tsConfig.compilerOptions.preserveValueImports = false;
        tsConfig.compilerOptions.importsNotUsedAsValues = 'remove';
        tsConfig.compilerOptions.verbatimModuleSyntax = false;
        await (0, ts_config_1.setTSConfig)(name, tsConfig, configName);
    }
    async putAssets(name, version, template) {
        const assets = (0, path_1.join)(consts_1.assetsStack, 'vue', 'modules', 'vite');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(assets, src, {
            recursive: true,
            overwrite: true
        });
        if (version === 2) {
            const appFile = await fs_1.default.promises.readFile((0, path_1.join)(src, 'App.vue'), { encoding: 'utf-8' });
            await fs_1.default.promises.writeFile((0, path_1.join)(src, 'App.vue'), appFile.replace(/<!--(.*)-->/g, '$1'));
        }
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
exports.VueViteBuilder = VueViteBuilder;
