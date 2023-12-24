import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs'
import npa from 'npm-package-arg'
import { dirname, parse, resolve } from 'path'

export type DependenciesAlias = Record<string, string>

function resolvePaths(alias: DependenciesAlias, aliasDirectory: string): DependenciesAlias {
  const entries = Object.entries(alias)
    .map(([name, source]) => {
      if (parse(source).dir !== '') return [name, resolve(aliasDirectory, source)]

      return [name, source]
    })

  return Object.fromEntries(entries)
}

export async function install(cwd: string, dependencies: string[], aliases?: DependenciesAlias | string, force?: boolean) {
  const aliasesMap = typeof aliases === 'string'
    ? resolvePaths(JSON.parse(await fs.promises.readFile(aliases, { encoding: 'utf-8' })), dirname(aliases))
    : aliases

  const deps = aliasesMap ? dependencies.map(packageSpec => {
    const name = npa(packageSpec).name

    return (name ? aliasesMap[name] : null) || packageSpec
  }) : dependencies

  console.log('Installing dependencies:', deps.map(dep => chalk.green(dep)).join(', '))

  await execa('npm', ['i', ...(force ? ['-f'] : []), ...deps], { stdio: 'inherit', cwd })
}
