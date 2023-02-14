#!/usr/bin/env node

import { createCommand, Option } from 'commander'

import bulkBuild from './bulk-build'
import plugin from './plugin'

const program = createCommand()

program.version(require('../package.json').version)

program
    .command('bulk-build')
    .description(`
        Build several packages by inserting them into node_modules of each other
        (for development purposes)
    `)
    .option('-f --folders <folders>')
    .addOption(new Option('-a --approach <approach>').choices(['print', 'inplace']))
    .action((options: { folders?: string, approach?: string }) => {
        bulkBuild(options.folders, options.approach)
    })

program
    .command('plugin')
    .description('Create plugin boilerplate')
    .requiredOption('-n --name <name>')
    .action((options: { name: string }) => {
        plugin(options.name)
    })

program.parse(process.argv)

export {}
