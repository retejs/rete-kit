"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootContext = void 0;
const base_1 = require("../base");
class BootContext extends base_1.Context {
    constructor() {
        super(...arguments);
        this.name = 'boot';
        this.description = 'New App Creation - Guide users through creating a brand new Rete.js application from scratch';
        this.instructions = [
            { file: 'instructions.md', title: 'Boot Context - New App Creation' }
        ];
    }
}
exports.BootContext = BootContext;
