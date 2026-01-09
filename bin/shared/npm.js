"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageConfig = getPackageConfig;
exports.setPackageConfig = setPackageConfig;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
async function getPackageConfig(folder) {
    const path = (0, path_1.join)(folder, 'package.json');
    return (0, fs_extra_1.readJSON)(path);
}
async function setPackageConfig(folder, data) {
    const path = (0, path_1.join)(folder, 'package.json');
    await (0, fs_extra_1.writeJSON)(path, data, { spaces: 2 });
}
