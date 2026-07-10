"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTSConfig = getTSConfig;
exports.setTSConfig = setTSConfig;
const decomment_1 = __importDefault(require("decomment"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
async function getTSConfig(folder, name = 'tsconfig.json') {
    const path = (0, path_1.join)(folder, name);
    return JSON.parse((0, decomment_1.default)(await (0, fs_extra_1.readFile)(path, { encoding: 'utf-8' })));
}
async function setTSConfig(folder, data, name = 'tsconfig.json') {
    const path = (0, path_1.join)(folder, name);
    await (0, fs_extra_1.writeJSON)(path, data, { spaces: 2 });
}
