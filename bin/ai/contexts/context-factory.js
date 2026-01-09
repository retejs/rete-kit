"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableContexts = getAvailableContexts;
exports.getContextNames = getContextNames;
exports.getContext = getContext;
exports.isValidContext = isValidContext;
const boot_1 = require("./boot");
const dev_1 = require("./dev");
const onboard_1 = require("./onboard");
const plugin_1 = require("./plugin");
const contexts = new Map([
    ['onboard', new onboard_1.OnboardContext()],
    ['boot', new boot_1.BootContext()],
    ['dev', new dev_1.DevContext()],
    ['plugin', new plugin_1.PluginContext()]
]);
function getAvailableContexts() {
    return Array.from(contexts.values());
}
function getContextNames() {
    return Array.from(contexts.keys());
}
function getContext(name) {
    return contexts.get(name);
}
function isValidContext(name) {
    return contexts.has(name);
}
