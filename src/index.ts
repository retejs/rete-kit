#!/usr/bin/env node

import { createCommand, Option } from 'commander'

import build from './build'
import plugin from './plugin'

const program = createCommand()

program.version(require('../package.json').version)

program
  .command('build')
  .description(`
    Build several packages by inserting them into node_modules of each other
    (for development purposes)
  `)
  .requiredOption('-f --folders <folders>')
  .addOption(new Option('-a --approach <approach>').choices(['print', 'inplace']))
  .action((options: { folders: string }) => {
    build(options.folders.split(','))
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
