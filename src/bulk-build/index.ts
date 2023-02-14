
import chalk from 'chalk'
import concurrently from 'concurrently'
import { join } from 'path'

import { Approach, chooseApproach, choosePackages } from './inquirer'

type PackageFile = {
  name: string,
  dependencies: Record<string, string>
  peerDependencies: Record<string, string>
}

function loadPackageConfig(currentDirectory: string, folder: string) {
    const packagePath = join(currentDirectory, folder, 'package.json')
    const packageFile = require(packagePath) as PackageFile

    return packageFile
}

// eslint-disable-next-line max-statements
export default async function (foldersOptions?: string, approach?: string) {
    const currentDirectory = process.cwd()
    const packages = foldersOptions?.split(',') || await choosePackages(currentDirectory)
    const folders = packages.map(name => ({
        name,
        packageFile: loadPackageConfig(currentDirectory, name)
    }))

    const dependencyTree = folders.map(({ name, packageFile }) => {
        const dependencies = Object.keys(packageFile.dependencies || {})
        const peerDependencies = Object.keys(packageFile.peerDependencies || {})
        const allDependencies = Array.from(new Set([...dependencies, ...peerDependencies]))

        return {
            name: packageFile.name,
            folder: name,
            dependencies: allDependencies.filter(dependencyName => {
                return folders.map(p => p.packageFile.name).includes(dependencyName)
            })
        }
    })

    dependencyTree.sort((a, b) => {
        if (a.dependencies.includes(b.name)) return 1
        if (b.dependencies.includes(a.name)) return -1
        return 0
    })

    const commands = dependencyTree.map(({ name, folder }) => {
        const usedIn = dependencyTree.filter(item => item.dependencies.includes(name))
        const outputs = usedIn.map(dep => join('..', dep.folder, 'node_modules', name))
        const command = `npm --prefix ${folder} run build:dev -- --output ${outputs.join(',')}`

        return outputs.length ? {
            folder,
            command
        } : null
    }).filter((command): command is Exclude<typeof command, null> => command !== null)

    const choosedApproach = !approach
        ? await chooseApproach()
        : (approach === 'print' ? Approach.PRINT : Approach.IN_PLACE)

    if (choosedApproach === Approach.PRINT) {
        console.log(chalk.green('Insert the following commands in the terminals:'))
        commands.forEach(({ command }) => console.log(chalk.grey(command)))
    } else {
        const { result } = concurrently(commands.map(({ command, folder }) => {
            return {
                command,
                name: folder,
                cwd: currentDirectory
            }
        }))

        await result
    }
}
