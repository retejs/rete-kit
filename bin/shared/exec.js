"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
const execa_1 = __importDefault(require("execa"));
const exec = async (file, args, options) => {
    if (process.env.VERBOSE) {
        console.log(`exec: ${file} ${args === null || args === void 0 ? void 0 : args.join(' ')}`);
    }
    return (0, execa_1.default)(file, args, options);
};
exports.exec = exec;
