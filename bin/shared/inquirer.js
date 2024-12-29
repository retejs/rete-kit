"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.choosePackages = choosePackages;
exports.input = input;
exports.select = select;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
async function choosePackages(list) {
    const { packages } = await inquirer_1.default.prompt([
        {
            type: 'checkbox',
            message: 'Select packages',
            name: 'packages',
            choices: list.map(item => ({ name: `${item.folder} (${chalk_1.default.green(item.name)})`, value: item, checked: true }))
        }
    ]);
    return packages;
}
async function input(message) {
    const { text } = await inquirer_1.default.prompt([
        {
            type: 'input',
            message,
            name: 'text'
        }
    ]);
    return text;
}
async function select(message, choices, multi) {
    const { option } = await inquirer_1.default.prompt([
        {
            type: multi
                ? 'checkbox'
                : 'list',
            message,
            name: 'option',
            choices: choices
        }
    ]);
    return option;
}
