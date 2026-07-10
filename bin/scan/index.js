"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReteDependenciesFor = getReteDependenciesFor;
exports.default = scan;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const dependency_topo_1 = require("../shared/dependency-topo");
const npm_1 = require("../shared/npm");
async function isRetePackage(folder) {
    for (const item of await fs_1.default.promises.readdir(folder)) {
        if (item === 'package.json') {
            const config = await (0, npm_1.getPackageConfig)(folder);
            const { name, scripts = {}, peerDependencies = {} } = config;
            if (name === 'rete')
                return true;
            if (scripts.build && Object.keys(peerDependencies).includes('rete')) {
                return true;
            }
        }
    }
    return false;
}
async function findRetePackages(folder, depth = 0) {
    if (depth > 2)
        return [];
    if (await isRetePackage(folder))
        return [{ folder, name: (await (0, npm_1.getPackageConfig)(folder)).name }];
    const list = [];
    for (const item of await fs_1.default.promises.readdir(folder)) {
        const path = (0, path_1.join)(folder, item);
        if ((await fs_1.default.promises.stat(path)).isDirectory()) {
            const plugins = await findRetePackages(path, depth + 1);
            list.push(...plugins);
        }
    }
    return list;
}
function getSortedPackages(packages) {
    const copy = [...packages];
    copy.sort(a => (/render-plugin/).exec(a.name)
        ? -1
        : 0);
    const dependencyTopology = (0, dependency_topo_1.getDependencyTopo)(copy.map(({ folder }) => {
        return {
            folder,
            config: require((0, path_1.join)(folder, 'package.json'))
        };
    }));
    return dependencyTopology.map(item => ({
        folder: item.folder,
        name: item.config.name
    }));
}
async function getReteDependenciesFor(cwd, folder) {
    const config = await (0, npm_1.getPackageConfig)(folder);
    const dependencies = Object.keys({ ...config.dependencies, ...config.devDependencies });
    const packages = await scan(cwd);
    const matchedPackages = packages.filter(pkg => dependencies.includes(pkg.name));
    return matchedPackages;
}
async function scan(cwd) {
    const packages = await findRetePackages(cwd);
    return getSortedPackages(packages)
        .map(item => ({ ...item, folder: (0, path_1.relative)(cwd, item.folder) }));
}
