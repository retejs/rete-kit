"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevContext = void 0;
const base_1 = require("../base");
class DevContext extends base_1.Context {
    constructor() {
        super(...arguments);
        this.name = 'dev';
        this.description = 'Adding to Existing Projects - Help users add Rete.js to their existing codebase/application';
        this.instructions = [
            { file: 'instructions.md', title: 'Dev Context - Adding to Existing Projects' }
        ];
    }
}
exports.DevContext = DevContext;
