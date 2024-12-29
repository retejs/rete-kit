"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolsFor = getToolsFor;
exports.getConfigFor = getConfigFor;
const path_1 = require("path");
const legacy = {
    create: {
        version: '4'
    },
    kit: {
        version: '1'
    },
    adapter: {
        version: '2'
    }
};
const tools = {
    v5: {
        create: {
            version: '6',
            flags: ['--svelte5']
        },
        kit: {
            version: '2'
        },
        config: {
            path: '5'
        },
        adapter: {
            version: '3'
        }
    },
    v4: legacy,
    v3: legacy
};
function getToolsFor(version) {
    return tools[`v${version}`];
}
function getConfigFor(version) {
    const name = 'svelte.config.js';
    const path = version === 5
        ? '5'
        : '.';
    return {
        source: (0, path_1.join)(path, name),
        name
    };
}
