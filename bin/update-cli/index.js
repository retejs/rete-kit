"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCli = updateCli;
const chalk_1 = __importDefault(require("chalk"));
const execa_1 = __importDefault(require("execa"));
const path_1 = require("path");
const scan_1 = __importDefault(require("../scan"));
const inquirer_1 = require("../shared/inquirer");
async function updateCli(cwd) {
    const packages = await (0, scan_1.default)(cwd);
    const selected = await (0, inquirer_1.choosePackages)(packages);
    const version = await (0, inquirer_1.input)('CLI version or label (latest, next, etc.)');
    for (const { name, folder } of selected) {
        const reference = `rete-cli@${version}`;
        console.log(`Installing ${reference} for ${chalk_1.default.green(name)} in ${folder} folder`);
        await (0, execa_1.default)('npm', ['i', '-D', reference], { cwd: (0, path_1.join)(cwd, folder), stdio: 'inherit' });
        console.log(chalk_1.default.green(`${reference} has been installed for ${name}`));
    }
}
