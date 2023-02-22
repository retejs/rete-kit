#!/usr/bin/env node

import { createCommand, Option } from 'commander'

import app, { AppStack, appStacks } from './app'
import build from './build'
import plugin from './plugin'
import { getReteDependenciesFor } from './scan'
import { throwError } from './shared/throw'
import updateCli from './update-cli'

const program = createCommand()

program.version(require('../package.json').version)

program
  .command('build')
  .description(`Build several packages by inserting them into node_modules of each other`)
  .option('-f --folders <folders>')
  .option('-f --for <package>')
  .action(async (options: { folders?: string, for?: string }) => {
    if (options.folders) return build(options.folders.split(','))
    if (options.for) {
      const packages = await getReteDependenciesFor(process.cwd(), options.for)
      const folders = [...packages.map(pkg => pkg.folder), options.for]

      return build(folders)
    }
    throwError('--folders or --for option required')
  })

program
  .command('plugin')
  .description('Create plugin boilerplate')
  .requiredOption('-n --name <name>')
  .action((options: { name: string }) => {
    plugin(options.name)
  })

program
  .command('app')
  .alias('application')
  .description('Create editor application')
  .option('-n --name <name>')
  .addOption(new Option('-s --stack <name>').choices(appStacks))
  .addOption(new Option('-v --version <version>').argParser(parseInt))
  .addOption(new Option('-f --features <features>').argParser(arg => arg.split(',')))
  .addOption(new Option('-d --deps-alias <deps-alias>'))
  .action(async (options: { name?: string, stack?: AppStack, stackVersion?: number, features?: string[], depsAlias?: string }) => {
    app(options.name, options.stack, options.stackVersion, options.features, options.depsAlias)
  })

program
  .command('update-cli')
  .description('Update Rete CLI in several packages')
  .action(async () => {
    updateCli(process.cwd())
  })

program.parse(process.argv)

export {}
