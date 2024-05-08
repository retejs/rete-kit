import chalk from 'chalk'
import { join, relative } from 'path'

import { getDependencyTopo, PackageFile } from '../shared/dependency-topo'
import { throwError } from '../shared/throw'
import { awaitedExec } from './exec'

// eslint-disable-next-line max-statements
export async function build(folders: string[]) {
  if (folders.length === 0) throwError('no folders provided')

  const currentDirectory = process.cwd()
  const dependencyTopology = getDependencyTopo(folders.map(folder => {
    try {
      return {
        folder,
        config: require(join(currentDirectory, folder, 'package.json')) as PackageFile
      }
    } catch (e) {
      throwError(`Cannot find package in ./${folder}`)
      throw e
    }
  }))

  if (dependencyTopology.length === 0) throwError('no dependent packages found')

  const targetPackages = dependencyTopology.filter(({ dependent }) => dependent.length)

  process.stdout.write('\u001b[3J\u001b[1J')
  console.clear()
  console.log(chalk.bgGreen(' INFO '), chalk.green('The following packages will be built in watch mode:'))
  console.log(targetPackages.map(({ config, folder }) => {
    return `\t- ${config.name} ${chalk.grey(`(./${folder})`)}`
  }).join('\n'), '\n')
  console.log(chalk.bgGreen(' PREPARE '), chalk.green('Building...'))

  const commands = targetPackages.map(({ config, folder, dependent }) => {
    const dependentPackages = dependent.map(name => dependencyTopology.filter(n => n.config.name === name)).flat()
    const outputs = dependentPackages.map(dep => join(relative(folder, dep.folder), 'node_modules', config.name))

    if (!outputs.length) throwError(`outputs for ${config.name} is empty`)

    return {
      config,
      folder,
      command: 'npm',
      args: ['--silent', 'run', 'build', '--', '--watch', '--output', outputs.join(',')],
      cwd: folder
    }
  })

  for (const { config, command, args, cwd } of commands) {
    try {
      await awaitedExec(
        command,
        args,
        { cwd },
        {
          log: line => console.log(` [${config.name}] ${line}`),
          error: line => console.error(chalk.red(` [${config.name}] ${line}`)),
          resolveOn: line => /Build (\w+) completed/.test(line)
        }
      )
    } catch (e) {
      const commandString = `${command} ${args.join(' ')}`
      const message = String((e as Error).message).trim()

      throwError(`Failed to execute: ${commandString}. ${message}`)
    }
  }
  console.log(chalk.bgGreen(' READY '), chalk.green('Ready for development'))
  console.log(chalk.grey([
    '\t*',
    'make sure your application bundler doesn\'t cache',
    'these packages inside node_modules',
    '(important for HMR mode)'
  ].join(' ')))
}
