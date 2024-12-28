"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const deps_1 = require("./deps");
(0, globals_1.describe)('Plugin', () => {
    (0, globals_1.it)('deps', () => {
        (0, globals_1.expect)((0, deps_1.addConstraint)('~', '^0.1.0')).toEqual('~0.1.0');
    });
});
