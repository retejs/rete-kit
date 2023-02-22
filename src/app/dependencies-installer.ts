import execa from 'execa'
import fs from 'fs'
import { dirname, resolve } from 'path'

export type DependenciesAlias = Record<string, string>

function resolvePaths(alias: DependenciesAlias, aliasDirectory: string): DependenciesAlias {
  return Object.fromEntries(Object.entries(alias).map(([name, path]) => ([name, resolve(aliasDirectory, path)])))
}

export async function install(cwd: string, dependencies: string[], aliases?: DependenciesAlias | string) {
  const aliasesMap = typeof aliases === 'string'
    ? resolvePaths(JSON.parse(await fs.promises.readFile(aliases, { encoding: 'utf-8' })), dirname(aliases))
    : aliases

  const deps = aliasesMap ? dependencies.map(dep => {
    return aliasesMap[dep] || dep
  }) : dependencies

  await execa('npm', ['--prefix', cwd, 'i', ...deps], { stdio: 'inherit' })
}
