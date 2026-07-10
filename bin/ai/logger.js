"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.logger = {
    warn(message) {
        console.log(chalk_1.default.bgYellow(' WARN '), chalk_1.default.yellow(message));
    },
    info(message) {
        console.log(chalk_1.default.bgGreen(' INFO '), chalk_1.default.green(message));
    },
    ready(message) {
        console.log(chalk_1.default.bgGreen(' READY '), chalk_1.default.green(message));
    },
    skip(message) {
        console.log(chalk_1.default.bgYellow(' SKIP '), chalk_1.default.yellow(message));
    }
};
