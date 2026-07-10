"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure = ensure;
exports.commit = commit;
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const throw_1 = require("../shared/throw");
const patchDescriptor = '.rete-patch';
const kitVersion = require('../../package.json').version;
if (!kitVersion)
    (0, throw_1.throwError)('Kit version not found');
async function exists(name) {
    try {
        await fs_1.default.promises.access(name);
        return true;
    }
    catch (_error) {
        return false;
    }
}
async function validateDescriptor(path, expected) {
    const descriptor = JSON.parse(await fs_1.default.promises.readFile(path, { encoding: 'utf-8' }));
    if (descriptor.stack !== expected.stack) {
        return {
            issue: `\
        Stack mismatch \
        ("${descriptor.stack}" in the target directory instead of the expected "${expected.stack}")\
      `
        };
    }
    if (descriptor.version !== expected.version) {
        return {
            issue: `\
        Versions mismatch \
        ("${descriptor.version}" in the target directory instead of the expected "${expected.version}")\
      `
        };
    }
    if (descriptor.kitVersion !== expected.kitVersion) {
        return {
            issue: `\
        The application was created with a different version of Rete Kit\
        (the app was created using v${descriptor.kitVersion}, but the current version is v${expected.kitVersion})\
      `
        };
    }
    return { issue: null };
}
async function ensure(name, stack, version) {
    const folderExists = await exists(name);
    const descriptorPath = (0, path_1.join)(name, patchDescriptor);
    if (folderExists) {
        console.log('\n', chalk_1.default.bgGreen(' PATCH '), chalk_1.default.yellow('The app directory exists. Checking if it can be patched...'));
    }
    else {
        return { exists: false };
    }
    const descriptorExists = await exists(descriptorPath);
    if (!descriptorExists) {
        (0, throw_1.throwError)(`\
      Patch descriptor (${descriptorPath}) not found.\
      Probably this app was created using an older version of Rete Kit or some other tool\
    `);
    }
    const { issue } = await validateDescriptor(descriptorPath, { stack, version, kitVersion });
    if (issue)
        (0, throw_1.throwError)(issue);
    return { exists: true };
}
async function commit(name, stack, version) {
    const descriptor = { stack, version, kitVersion };
    const content = JSON.stringify(descriptor, null, '\t');
    await fs_1.default.promises.writeFile((0, path_1.join)(name, patchDescriptor), content);
    console.log('\n', chalk_1.default.bgGreen(' PATCH '), chalk_1.default.green('Ready'));
}
