"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViteBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const ts_config_1 = require("../../../shared/ts-config");
const consts_1 = require("../../consts");
class ViteBuilder {
    constructor() {
        this.name = 'Vite';
        this.versions = [16, 17, 18];
        this.foundation = 'react';
    }
    async create(name) {
        await (0, execa_1.default)('npm', [
            'create', `vite@latest`, name, '--', '--template', 'vanilla-ts', '-y'
        ], { stdio: 'inherit' });
        await (0, execa_1.default)('npm', ['i'], { cwd: (0, path_1.join)(process.cwd(), name), stdio: 'inherit' });
        const tsConfig = await (0, ts_config_1.getTSConfig)(name);
        tsConfig.compilerOptions.jsx = 'react-jsx';
        await (0, ts_config_1.setTSConfig)(name, tsConfig);
    }
    async putAssets(name) {
        const customization = (0, path_1.join)(consts_1.assetsStack, 'react', 'modules', 'vite', 'customization');
        const assets = (0, path_1.join)(consts_1.assetsStack, 'react', 'modules', 'vite', 'assets');
        const modules = (0, path_1.join)(consts_1.assetsStack, 'vite', 'modules');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(customization, (0, path_1.join)(src, 'customization'), {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(assets, (0, path_1.join)(src, 'assets'), {
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
exports.ViteBuilder = ViteBuilder;
