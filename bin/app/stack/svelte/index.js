"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const ts_config_1 = require("../../../shared/ts-config");
const consts_1 = require("../../consts");
class SvelteBuilder {
    constructor() {
        this.name = 'Svelte';
        this.versions = [3, 4];
        this.foundation = 'svelte';
    }
    async create(name, version) {
        await (0, execa_1.default)('npm', [
            'create', `svelte-with-args@4`, '-y',
            '--',
            '--name', name,
            '--template', 'default',
            '--types', 'typescript',
            '--no-prettier', '--no-eslint', '--no-playwright', '--no-vitest'
        ], { stdio: 'inherit' });
        await (0, execa_1.default)('npm', ['i'], { cwd: (0, path_1.join)(process.cwd(), name), stdio: 'inherit' });
        const tsConfig = await (0, ts_config_1.getTSConfig)(name);
        tsConfig.compilerOptions.preserveValueImports = false;
        tsConfig.compilerOptions.importsNotUsedAsValues = 'preserve';
        await (0, ts_config_1.setTSConfig)(name, tsConfig);
        await (0, execa_1.default)('npm', [
            'i',
            `svelte@${version}`,
            `@sveltejs/kit@1`
        ], { stdio: 'inherit', cwd: name });
        const configName = 'svelte.config.js';
        await fs_extra_1.default.copy((0, path_1.join)(consts_1.assetsStack, 'svelte', configName), (0, path_1.join)(name, configName), { overwrite: true });
        await (0, execa_1.default)('npm', ['i', `@sveltejs/adapter-static@2`], { stdio: 'inherit', cwd: name });
    }
    async putAssets(name) {
        const modules = (0, path_1.join)(consts_1.assetsStack, 'svelte', 'modules');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(modules, src, {
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
exports.SvelteBuilder = SvelteBuilder;
