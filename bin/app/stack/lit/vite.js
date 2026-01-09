"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LitViteBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const consts_1 = require("../../consts");
class LitViteBuilder {
    constructor() {
        this.name = 'Lit.js Vite';
        this.versions = [3];
        this.foundation = 'lit';
    }
    async create(name, version) {
        await (0, execa_1.default)('npm', [
            'create', `vite@latest`, name, '--', '--template', 'vanilla-ts', '-y'
        ], { stdio: 'inherit' });
        await (0, execa_1.default)('npm', [
            'i',
            `lit@${version}`
        ], {
            cwd: (0, path_1.join)(process.cwd(), name),
            stdio: 'inherit'
        });
    }
    async putAssets(name) {
        const modules = (0, path_1.join)(consts_1.assetsStack, 'lit', 'modules');
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
        return 'dist';
    }
    getBuildCommand() {
        return 'build';
    }
}
exports.LitViteBuilder = LitViteBuilder;
