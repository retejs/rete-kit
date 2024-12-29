"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = build;
const chalk_1 = __importDefault(require("chalk"));
const path_1 = require("path");
const dependency_topo_1 = require("../shared/dependency-topo");
const throw_1 = require("../shared/throw");
const exec_1 = require("./exec");
// eslint-disable-next-line max-statements
async function build(folders) {
    if (folders.length === 0)
        (0, throw_1.throwError)('no folders provided');
    const currentDirectory = process.cwd();
    const dependencyTopology = (0, dependency_topo_1.getDependencyTopo)(folders.map(folder => {
        try {
            return {
                folder,
                config: require((0, path_1.join)(currentDirectory, folder, 'package.json'))
            };
        }
        catch (e) {
            (0, throw_1.throwError)(`Cannot find package in ./${folder}`);
            throw e;
        }
    }));
    if (dependencyTopology.length === 0)
        (0, throw_1.throwError)('no dependent packages found');
    const targetPackages = dependencyTopology.filter(({ dependent }) => dependent.length);
    process.stdout.write('\u001b[3J\u001b[1J');
    console.clear();
    console.log(chalk_1.default.bgGreen(' INFO '), chalk_1.default.green('The following packages will be built in watch mode:'));
    console.log(targetPackages.map(({ config, folder }) => {
        return `\t- ${config.name} ${chalk_1.default.grey(`(./${folder})`)}`;
    }).join('\n'), '\n');
    console.log(chalk_1.default.bgGreen(' PREPARE '), chalk_1.default.green('Building...'));
    const commands = targetPackages.map(({ config, folder, dependent }) => {
        const dependentPackages = dependent.map(name => dependencyTopology.filter(n => n.config.name === name)).flat();
        const outputs = dependentPackages.map(dep => (0, path_1.join)((0, path_1.relative)(folder, dep.folder), 'node_modules', config.name));
        if (!outputs.length)
            (0, throw_1.throwError)(`outputs for ${config.name} is empty`);
        return {
            config,
            folder,
            command: 'npm',
            args: ['--silent', 'run', 'build', '--', '--watch', '--output', outputs.join(',')],
            cwd: folder
        };
    });
    for (const { config, command, args, cwd } of commands) {
        try {
            await (0, exec_1.awaitedExec)(command, args, { cwd }, {
                log: line => {
                    console.log(` [${config.name}] ${line}`);
                },
                error: line => {
                    console.error(chalk_1.default.red(` [${config.name}] ${line}`));
                },
                resolveOn: line => (/Build (\w+) completed/).test(line)
            });
        }
        catch (e) {
            const commandString = `${command} ${args.join(' ')}`;
            const message = String(e.message).trim();
            (0, throw_1.throwError)(`Failed to execute: ${commandString}. ${message}`);
        }
    }
    console.log(chalk_1.default.bgGreen(' READY '), chalk_1.default.green('Ready for development'));
    console.log(chalk_1.default.grey([
        '\t*',
        'make sure your application bundler doesn\'t cache',
        'these packages inside node_modules',
        '(important for HMR mode)'
    ].join(' ')));
}
