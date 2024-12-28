"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const dependency_topo_1 = require("./dependency-topo");
(0, globals_1.describe)('Dependency topology', () => {
    (0, globals_1.it)('basic', () => {
        const a = { name: 'a' };
        const b = { name: 'b', dependencies: { a: '', c: '' } };
        const c = { name: 'c', dependencies: { a: '' } };
        const packages = [
            {
                folder: './pkgs/a',
                config: a
            },
            {
                folder: './pkgs/b',
                config: b
            },
            {
                folder: './c',
                config: c
            }
        ];
        const dirs = (0, dependency_topo_1.getDependencyTopo)(packages);
        (0, globals_1.expect)(dirs).toEqual([
            {
                dependencies: [],
                dependent: ['b', 'c'],
                folder: './pkgs/a',
                config: a
            },
            {
                dependencies: ['a'],
                dependent: ['b'],
                folder: './c',
                config: c
            },
            {
                dependencies: ['a', 'c'],
                dependent: [],
                folder: './pkgs/b',
                config: b
            }
        ]);
    });
    (0, globals_1.it)('no dependent', () => {
        const packages = [
            {
                folder: './pkgs/a',
                config: { name: 'a' }
            },
            {
                folder: './pkgs/b',
                config: { name: 'b' }
            }
        ];
        const dirs = (0, dependency_topo_1.getDependencyTopo)(packages);
        (0, globals_1.expect)(dirs).toEqual([]);
    });
});
