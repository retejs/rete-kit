"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardContext = void 0;
const base_1 = require("../base");
class OnboardContext extends base_1.Context {
    constructor() {
        super(...arguments);
        this.name = 'onboard';
        this.description = 'Learning & Concepts - Help users new to Rete.js understand fundamentals';
        this.instructions = [
            { file: 'instructions.md', title: 'Onboard Context - Learning & Concepts' }
        ];
    }
}
exports.OnboardContext = OnboardContext;
