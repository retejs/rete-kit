"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const path_1 = require("path");
const consts_1 = require("../../consts");
class Context {
    getName() {
        return this.name;
    }
    getInstructions() {
        const instructionsPath = (0, path_1.join)(consts_1.assetsAI, this.name);
        return this.instructions.map(instruction => ({
            ...instruction,
            path: (0, path_1.join)(instructionsPath, instruction.file),
            contextId: this.name
        }));
    }
}
exports.Context = Context;
