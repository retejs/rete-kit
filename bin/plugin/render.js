"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplates = renderTemplates;
const replace_in_file_1 = __importDefault(require("replace-in-file"));
function renderTemplates(folder, locals) {
    const keys = Object.keys(locals);
    const from = keys.map(key => new RegExp('{{' + key + '}}', 'g'));
    const to = keys.map(key => locals[key]);
    replace_in_file_1.default.sync({
        files: `${folder}/**/*`,
        from,
        to
    });
}
