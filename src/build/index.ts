import chalk from 'chalk'
import { join } from 'path'

import { getDependencyTopo, PackageFile } from '../shared/dependency-topo'
import { throwError } from '../shared/throw'
import { awaitedExec } from './exec'

// eslint-disable-next-line max-statements
export default async function (folders: string[]) {
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

  console.log(targetPackages.map(({ config, folder }) => {
    return `\t- ${config.name} ${chalk.grey(`(./${folder})`)}`
  }).join('\n'), '\n')

  const commands = targetPackages.map(({ config, folder, dependent }) => {
    const dependentPackages = dependent.map(name => dependencyTopology.filter(n => n.config.name === name)).flat()
    const outputs = dependentPackages.map(dep => join('..', dep.folder, 'node_modules', config.name))

    if (!outputs.length) throwError(`outputs for ${config.name} is empty`)

    return {
      config,
      folder,
      command: 'npm',
      args: ['--prefix', folder, '--silent', 'run', 'build', '--', '--watch', '--output', outputs.join(',')]
    }
  })

  for (const { config, command, args } of commands) {
    await awaitedExec(
      command,
      args,
      line => console.log(` [${config.name}] ${line}`),
      line => /Build (\w+) completed/.test(line)
    )
  }
}
