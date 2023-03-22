import execa from 'execa'
import fs from 'fs'
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

export async function install(cwd: string, dependencies: string[], aliases?: DependenciesAlias | string) {
  const aliasesMap = typeof aliases === 'string'
    ? resolvePaths(JSON.parse(await fs.promises.readFile(aliases, { encoding: 'utf-8' })), dirname(aliases))
    : aliases

  const deps = aliasesMap ? dependencies.map(dep => {
    return aliasesMap[dep] || dep
  }) : dependencies

  await execa('npm', ['--prefix', cwd, 'i', ...deps], { stdio: 'inherit' })
}
