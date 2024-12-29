"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvelteBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const exec_1 = require("../../../shared/exec");
const ts_config_1 = require("../../../shared/ts-config");
const consts_1 = require("../../consts");
const template_builder_helpers_1 = require("../../template-builder-helpers");
const compatibility_1 = require("./compatibility");
class SvelteBuilder {
    constructor() {
        this.name = 'Svelte';
        this.versions = [3, 4, 5];
        this.foundation = 'svelte';
    }
    async create(name, version) {
        var _a;
        const tools = (0, compatibility_1.getToolsFor)(version);
        await (0, exec_1.exec)('npx', [
            `create-svelte-with-args@${tools.create.version}`,
            '--name', name,
            '--template', 'default',
            '--types', 'typescript',
            '--no-prettier', '--no-eslint', '--no-playwright', '--no-vitest',
            ...(_a = tools.create.flags) !== null && _a !== void 0 ? _a : []
        ], { stdio: 'inherit' });
        await (0, exec_1.exec)('npm', ['i'], { cwd: (0, path_1.join)(process.cwd(), name), stdio: 'inherit' });
        const tsConfig = await (0, ts_config_1.getTSConfig)(name);
        tsConfig.compilerOptions.preserveValueImports = false;
        tsConfig.compilerOptions.importsNotUsedAsValues = 'preserve';
        tsConfig.compilerOptions.verbatimModuleSyntax = false;
        await (0, ts_config_1.setTSConfig)(name, tsConfig);
        await (0, exec_1.exec)('npm', [
            'i',
            `svelte@${version}`,
            `@sveltejs/kit@${tools.kit.version}`
        ], { stdio: 'inherit', cwd: name });
        const { name: configName, source } = (0, compatibility_1.getConfigFor)(version);
        await fs_extra_1.default.copy((0, path_1.join)(consts_1.assetsStack, 'svelte', source), (0, path_1.join)(name, configName), { overwrite: true });
        await (0, exec_1.exec)('npm', ['i', `@sveltejs/adapter-static@${tools.adapter.version}`], { stdio: 'inherit', cwd: name });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    async putAssets(name, _version, template) {
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
        const fileTemplate = new template_builder_helpers_1.FileTemplate(template);
        await fileTemplate.apply([
            (0, path_1.join)(src, 'customization', 'CustomConnection.svelte'),
            (0, path_1.join)(src, 'customization', 'CustomNode.svelte'),
            (0, path_1.join)(src, 'routes', '+layout.svelte'),
            (0, path_1.join)(src, 'routes', '+page.svelte')
        ], false);
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
