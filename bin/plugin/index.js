"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlugin = createPlugin;
const case_1 = __importDefault(require("case"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const recursive_copy_1 = __importDefault(require("recursive-copy"));
const deps_1 = require("./deps");
const render_1 = require("./render");
async function createDir(folder) {
    const boilerplateFolder = (0, path_1.join)(__dirname, '..', '..', 'assets', 'plugin-boilerplate');
    await fs_1.default.promises.access(boilerplateFolder);
    await fs_1.default.promises.mkdir(folder);
    await (0, recursive_copy_1.default)(boilerplateFolder, folder, { dot: true });
}
async function createPlugin(name) {
    const lowerCaseName = name.toLowerCase();
    const pluginName = case_1.default.capital(lowerCaseName);
    const packageName = case_1.default.kebab(`rete ${lowerCaseName} plugin`);
    const namespace = case_1.default.pascal(`${lowerCaseName} plugin`);
    const bundleName = case_1.default.kebab(`${lowerCaseName} plugin`);
    const folderName = packageName;
    const id = case_1.default.kebab(lowerCaseName);
    const cliVersion = (0, deps_1.addConstraint)('^', (0, deps_1.getCliVersion)());
    await createDir(folderName);
    (0, render_1.renderTemplates)(folderName, {
        pluginName,
        packageName,
        namespace,
        bundleName,
        folderName,
        cliVersion,
        id
    });
}
