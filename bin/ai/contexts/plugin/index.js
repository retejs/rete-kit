"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContext = void 0;
const base_1 = require("../base");
class PluginContext extends base_1.Context {
    constructor() {
        super(...arguments);
        this.name = 'plugin';
        this.description = 'Plugin Development & Debugging - Support advanced users developing, debugging, '
            + 'or customizing plugins';
        this.instructions = [
            { file: 'architecture.md', title: 'Plugin Architecture' },
            { file: 'workflow.md', title: 'Development Workflow' },
            { file: 'protocol.md', title: 'Complete Coverage Protocol' }
        ];
    }
}
exports.PluginContext = PluginContext;
