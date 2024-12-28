"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const consts_1 = require("../../consts");
class ReactBuilder {
    constructor() {
        this.name = 'React.js';
        this.versions = [16, 17, 18];
        this.foundation = 'react';
    }
    async create(name, version) {
        await (0, execa_1.default)('npx', ['create-react-app', '--template', 'typescript', name], { stdio: 'inherit' });
        await (0, execa_1.default)('npm', [
            'i',
            `react@${version}`,
            `react-dom@${version}`,
            version < 18
                ? `@testing-library/react@12`
                : `@testing-library/react@13`
        ], { stdio: 'inherit', cwd: name });
    }
    async putAssets(name, version) {
        const modules = (0, path_1.join)(consts_1.assetsStack, 'react', 'modules', 'cra');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, src, {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.copy(modules, src, {
            recursive: true,
            overwrite: true,
            filter(source) {
                if (source.endsWith('index.tsx'))
                    return version < 18;
                return true;
            }
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
exports.ReactBuilder = ReactBuilder;
