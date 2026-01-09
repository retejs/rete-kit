"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConstraint = addConstraint;
exports.getCliVersion = getCliVersion;
function addConstraint(target, constraint) {
    return constraint.replace(/^[^~]/, target);
}
function getCliVersion() {
    const { dependencies, devDependencies } = require('../../package.json');
    const constraint = dependencies['rete-cli'] || devDependencies['rete-cli'];
    return constraint;
}
