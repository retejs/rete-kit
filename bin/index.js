#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ai_1 = require("./ai");
const contexts_1 = require("./ai/contexts");
const guidance_1 = require("./ai/guidance");
const logger_1 = require("./ai/logger");
const app_1 = require("./app");
const build_1 = require("./build");
const plugin_1 = require("./plugin");
const scan_1 = require("./scan");
const throw_1 = require("./shared/throw");
const tty_1 = require("./shared/tty");
const update_cli_1 = require("./update-cli");
const program = (0, commander_1.createCommand)();
program.version(require('../package.json').version);
program
    .command('build')
    .description(`Build several packages by inserting them into node_modules of each other`)
    .option('-f --folders <folders>')
    .option('-f --for <package>')
    .action(async (options) => {
    if (options.folders)
        return (0, build_1.build)(options.folders.split(','));
    if (options.for) {
        const packages = await (0, scan_1.getReteDependenciesFor)(process.cwd(), options.for);
        const folders = [...packages.map(pkg => pkg.folder), options.for];
        return (0, build_1.build)(folders);
    }
    (0, throw_1.throwError)('--folders or --for option required');
});
program
    .command('plugin')
    .description('Create plugin boilerplate')
    .requiredOption('-n --name <name>')
    .action(async (options) => {
    await (0, plugin_1.createPlugin)(options.name);
});
program
    .command('app')
    .alias('application')
    .description('Create editor application')
    .option('-n --name <name>')
    .addOption(new commander_1.Option('-s --stack <name>').choices(app_1.appStacks))
    .addOption(new commander_1.Option('-v --stack-version <version>').argParser(parseInt))
    .addOption(new commander_1.Option('-f --features <features>').argParser(arg => arg.split(',')))
    .addOption(new commander_1.Option('-d --deps-alias <deps-alias>'))
    .addOption(new commander_1.Option('-n --next'))
    .addOption(new commander_1.Option('-F --force-install'))
    .action(async (options) => {
    await (0, app_1.createApp)({
        name: options.name,
        stack: options.stack,
        version: options.stackVersion,
        features: options.features,
        depsAlias: options.depsAlias,
        forceInstall: options.forceInstall,
        next: options.next
    });
});
program
    .command('update-cli')
    .description('Update Rete CLI in several packages')
    .action(async () => {
    await (0, update_cli_1.updateCli)(process.cwd());
});
const toolOption = new commander_1.Option('-t, --tool <tool>', 'Tool to generate instructions for').choices((0, ai_1.getToolNames)());
const contextOption = new commander_1.Option('-c, --context <context>', 'Context for instructions').choices((0, contexts_1.getContextNames)());
program
    .command('ai')
    .description('Create AI instructions for code editors')
    .option('-f, --force', 'Force overwrite existing files without confirmation')
    .option('-i, --interactive', 'Enable interactive mode to specify parameters interactively (requires TTY)')
    .addOption(toolOption)
    .addOption(contextOption)
    .action(async (options) => {
    // Check TTY once - interactive mode can only be enabled when TTY is available
    const hasTTY = (0, tty_1.isTTY)();
    if (options.interactive && !hasTTY) {
        console.error('\nError: --interactive option requires an interactive terminal (TTY).\n');
        process.exit(1);
    }
    // Interactive mode is only enabled if --interactive flag is explicitly provided AND TTY is available
    const interactive = options.interactive === true && hasTTY;
    try {
        await (0, ai_1.buildInstructions)(options.tool, options.context, options.force, interactive);
    }
    catch (error) {
        if (error instanceof guidance_1.GuidanceError) {
            const guidance = await error.guidance;
            if (guidance) {
                console.log(); // Add spacing before guidance
                logger_1.logger.info(guidance);
            }
            (0, throw_1.throwError)(error.message);
        }
        throw error;
    }
});
program.parse(process.argv);
