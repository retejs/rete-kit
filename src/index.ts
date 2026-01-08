#!/usr/bin/env node

import { createCommand, Option } from 'commander'

import { buildInstructions, getToolNames } from './ai'
import { getContextNames } from './ai/contexts'
import { GuidanceError } from './ai/guidance'
import { logger } from './ai/logger'
import { AppStack, appStacks, createApp } from './app'
import { build } from './build'
import { createPlugin } from './plugin'
import { getReteDependenciesFor } from './scan'
import { throwError } from './shared/throw'
import { isTTY } from './shared/tty'
import { updateCli } from './update-cli'

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
  .action(async (options: { name: string }) => {
    await createPlugin(options.name)
  })

program
  .command('app')
  .alias('application')
  .description('Create editor application')
  .option('-n --name <name>')
  .addOption(new Option('-s --stack <name>').choices(appStacks))
  .addOption(new Option('-v --stack-version <version>').argParser(parseInt))
  .addOption(new Option('-f --features <features>').argParser(arg => arg.split(',')))
  .addOption(new Option('-d --deps-alias <deps-alias>'))
  .addOption(new Option('-n --next'))
  .addOption(new Option('-F --force-install'))
  .action(async (options: {
    name?: string
    stack?: AppStack
    stackVersion?: number
    features?: string[]
    depsAlias?: string
    forceInstall?: boolean
    next?: boolean
  }) => {
    await createApp({
      name: options.name,
      stack: options.stack,
      version: options.stackVersion,
      features: options.features,
      depsAlias: options.depsAlias,
      forceInstall: options.forceInstall,
      next: options.next
    })
  })

program
  .command('update-cli')
  .description('Update Rete CLI in several packages')
  .action(async () => {
    await updateCli(process.cwd())
  })

const toolOption = new Option('-t, --tool <tool>', 'Tool to generate instructions for').choices(getToolNames())
const contextOption = new Option('-c, --context <context>', 'Context for instructions').choices(getContextNames())

program
  .command('ai')
  .description('Create AI instructions for code editors')
  .option('-f, --force', 'Force overwrite existing files without confirmation')
  .option('-i, --interactive', 'Enable interactive mode to specify parameters interactively (requires TTY)')
  .addOption(toolOption)
  .addOption(contextOption)
  .action(async (options: { tool?: string, context?: string, force?: boolean, interactive?: boolean }) => {
    // Check TTY once - interactive mode can only be enabled when TTY is available
    const hasTTY = isTTY()

    if (options.interactive && !hasTTY) {
      console.error('\nError: --interactive option requires an interactive terminal (TTY).\n')
      process.exit(1)
    }

    // Interactive mode is only enabled if --interactive flag is explicitly provided AND TTY is available
    const interactive = options.interactive === true && hasTTY

    try {
      await buildInstructions(options.tool, options.context, options.force, interactive)
    } catch (error) {
      if (error instanceof GuidanceError) {
        const guidance = await error.guidance
        if (guidance) {
          console.log() // Add spacing before guidance
          logger.info(guidance)
        }
        throwError(error.message)
      }
      throw error
    }
  })

program.parse(process.argv)

export { }
