"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.awaitedExec = awaitedExec;
/* eslint-disable @typescript-eslint/naming-convention */
const execa_1 = __importDefault(require("execa"));
async function awaitedExec(command, args, options, events) {
    const execaInstance = (0, execa_1.default)(command, args, { env: { FORCE_COLOR: 'true' }, ...options });
    await new Promise((resolve, reject) => {
        var _a, _b;
        (_a = execaInstance.stdout) === null || _a === void 0 ? void 0 : _a.addListener('data', (chunk) => {
            const str = chunk.toString();
            if (!str)
                return;
            const lines = str.trim().split('\n');
            lines.forEach(events.log);
            if (lines.some(events.resolveOn))
                resolve();
        });
        (_b = execaInstance.stderr) === null || _b === void 0 ? void 0 : _b.addListener('data', (chunk) => {
            const str = chunk.toString();
            if (!str)
                return;
            const lines = str.trim().split('\n');
            lines.forEach(events.error);
        });
        // reject on exit code !== 0
        void execaInstance.on('exit', code => {
            if (code !== 0) {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}
