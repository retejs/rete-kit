"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCompatibleTS = installCompatibleTS;
exports.installCompatibleTypes = installCompatibleTypes;
/* eslint-disable @typescript-eslint/naming-convention */
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const npm_1 = require("../../../shared/npm");
const ts_config_1 = require("../../../shared/ts-config");
async function installCompatibleTS(path, version) {
    // eslint-disable-next-line max-len
    console.log(chalk_1.default.bgGreen(' INFO '), chalk_1.default.green(`Enforcing the installation of TypeScript ${version} for the specified Angular version (adding "overrides" and "disableTypeScriptVersionCheck")`));
    const config = await (0, npm_1.getPackageConfig)(path);
    const tsOverride = {
        typescript: `^${version}`
    };
    config.overrides = {
        '@angular-devkit/build-angular': tsOverride,
        '@angular/compiler-cli': tsOverride
    };
    await (0, npm_1.setPackageConfig)(path, config);
    await (0, execa_1.default)('npm', ['i', `typescript@${version}`], { cwd: path });
    const tsConfig = await (0, ts_config_1.getTSConfig)(path);
    tsConfig.angularCompilerOptions.disableTypeScriptVersionCheck = true;
    await (0, ts_config_1.setTSConfig)(path, tsConfig);
}
async function installCompatibleTypes(path, versions) {
    // eslint-disable-next-line max-len
    console.log(chalk_1.default.bgGreen(' INFO '), chalk_1.default.green(`Installing compatible @types/node ${versions.node} to avoid build issues`));
    await (0, execa_1.default)('npm', ['i', `@types/node@${versions.node}`], { cwd: path });
}
