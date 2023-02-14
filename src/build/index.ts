import concurrently from 'concurrently'
import { join } from 'path'

import { getDependencyTopo } from '../shared/dependency-topo'
import { throwError } from '../shared/throw'

export default async function (folders: string[]) {
  if (folders.length === 0) throwError('no folders provided')

  const currentDirectory = process.cwd()
  const dependencyTopology = getDependencyTopo(folders.map(folder => {
    try {
      return {
        folder,
        config: require(join(currentDirectory, folder, 'package.json'))
      }
    } catch (e) {
      throwError(`Cannot find package in ./${folder}`)
      throw e
    }
  }))

  if (dependencyTopology.length === 0) throwError('no dependent packages found')

  const commands = dependencyTopology.map(({ config, folder }) => {
    const usedIn = dependencyTopology.filter(item => item.dependencies.includes(config.name))
    const outputs = usedIn.map(dep => join('..', dep.folder, 'node_modules', config.name))
    const command = `npm --prefix ${folder} run build:dev -- --output ${outputs.join(',')}`

    return outputs.length ? {
      folder,
      command
    } : null
  }).filter((command): command is Exclude<typeof command, null> => command !== null)

  const { result } = concurrently(commands.map(({ command, folder }) => {
    return {
      command,
      name: folder,
      cwd: currentDirectory
    }
  }))

  await result
}
