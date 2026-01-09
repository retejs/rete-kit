"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = throwError;
const chalk_1 = __importDefault(require("chalk"));
function throwError(message) {
    const label = chalk_1.default.black.bgRgb(220, 50, 50)(' FAIL ');
    console.warn('\n', label, chalk_1.default.red(message.replace(/( {1,})/g, ' ').replace(/^ /, '')));
    process.exit(1);
}
