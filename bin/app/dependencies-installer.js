"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = install;
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
const path_1 = require("path");
function resolvePaths(alias, aliasDirectory) {
    const entries = Object.entries(alias)
        .map(([name, source]) => {
        if ((0, path_1.parse)(source).dir !== '')
            return [name, (0, path_1.resolve)(aliasDirectory, source)];
        return [name, source];
    });
    return Object.fromEntries(entries);
}
async function install(cwd, dependencies, aliases, force) {
    const aliasesMap = typeof aliases === 'string'
        ? resolvePaths(JSON.parse(await fs_1.default.promises.readFile(aliases, { encoding: 'utf-8' })), (0, path_1.dirname)(aliases))
        : aliases;
    const deps = aliasesMap
        ? dependencies.map(packageSpec => {
            const name = (0, npm_package_arg_1.default)(packageSpec).name;
            return (name
                ? aliasesMap[name]
                : null) || packageSpec;
        })
        : dependencies;
    console.log('Installing dependencies:', deps.map(dep => chalk_1.default.green(dep)).join(', '));
    await (0, execa_1.default)('npm', ['i', ...force
            ? ['-f']
            : [], ...deps], { stdio: 'inherit', cwd });
}
