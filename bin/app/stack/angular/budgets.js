"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeBudgets = removeBudgets;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
async function removeBudgets(name) {
    const config = await fs_extra_1.default.readJSON((0, path_1.join)(name, 'angular.json'));
    config.projects[name].architect.build.configurations.production.budgets = [];
    await fs_extra_1.default.writeJSON((0, path_1.join)(name, 'angular.json'), config, { spaces: 2 });
}
