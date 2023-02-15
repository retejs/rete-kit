import fs from 'fs'
import { join, relative } from 'path'

import { getDependencyTopo, PackageFile } from '../shared/dependency-topo'

async function isRetePackage(folder: string) {
  for (const item of await fs.promises.readdir(folder)) {
    if (item === 'package.json') {
      const config = await getPackageConfig(folder)
      const { name, scripts = {}, peerDependencies = {} } = config

      if (name === 'rete') return true
      if (scripts['build'] && Object.keys(peerDependencies).includes('rete')) {
        return true
      }
    }
  }

  return false
}

async function getPackageConfig(folder: string) {
  const path = join(folder, 'package.json')
  const content = await fs.promises.readFile(path, { encoding: 'utf-8' })

  return JSON.parse(content)
}

export type Package = { folder: string, name: string }

async function findRetePackages(folder: string, depth = 0): Promise<Package[]> {
  if (depth > 2) return []
  if (await isRetePackage(folder)) return [{ folder, name: (await getPackageConfig(folder)).name }]

  const list: Package[] = []

  for (const item of await fs.promises.readdir(folder)) {
    const path = join(folder, item)

    if ((await fs.promises.stat(path)).isDirectory()) {
      const plugins = await findRetePackages(path, depth + 1)

      list.push(...plugins)
    }
  }

  return list
}

function getSortedPackages(packages: Package[]): Package[] {
  const copy = [...packages]

  copy.sort((a) => a.name.match('render-plugin') ? -1 : 0)

  const dependencyTopology = getDependencyTopo(copy.map(({ folder }) => {
    return {
      folder,
      config: require(join(folder, 'package.json')) as PackageFile
    }
  }))

  return dependencyTopology.map(item => ({
    folder: item.folder,
    name: item.config.name
  }))
}

export async function getReteDependenciesFor(cwd: string, folder: string): Promise<Package[]> {
  const config = await getPackageConfig(folder)
  const dependencies = Object.keys({ ...config.dependencies, ...config.devDependencies })
  const packages = await scan(cwd)
  const matchedPackages = packages.filter(pkg => dependencies.includes(pkg.name))

  return matchedPackages
}

export default async function scan(cwd: string) {
  const packages = await findRetePackages(cwd)

  return getSortedPackages(packages)
    .map(item => ({ ...item, folder: relative(cwd, item.folder) }))
}
