"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencyTopo = getDependencyTopo;
const toposort_1 = __importDefault(require("toposort"));
function getDependencyTopo(list) {
    const packages = Object.fromEntries(list.map(item => {
        const { config: { name, dependencies, peerDependencies } } = item;
        return [name, {
                ...item,
                dependencies: Object.keys({ ...dependencies, ...peerDependencies })
                    .filter(dependencyName => list.map(({ config }) => config.name).includes(dependencyName))
            }];
    }));
    const edges = Object.values(packages).reduce((acc, { config, dependencies }) => {
        return [
            ...acc,
            ...dependencies.map(dependencyName => [dependencyName, config.name])
        ];
    }, []);
    const topo = (0, toposort_1.default)(edges);
    return topo.map(name => ({
        ...packages[name],
        dependent: Object.values(packages)
            .filter(item => item.dependencies.includes(name))
            .map(item => item.config.name)
    }));
}
