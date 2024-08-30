import toposort from 'toposort'

export type PackageFile = {
  name: string
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
export type Dependencies = string[]
export type PackageMeta = { folder: string, config: PackageFile }
export type Topology = { dependent: Dependencies, dependencies: Dependencies }

export function getDependencyTopo<T extends PackageMeta>(list: T[]): (T & Topology)[] {
  const packages = Object.fromEntries(list.map(item => {
    const { config: { name, dependencies, peerDependencies } } = item

    return [name, {
      ...item,
      dependencies: Object.keys({ ...dependencies, ...peerDependencies })
        .filter(dependencyName => list.map(({ config }) => config.name).includes(dependencyName))
    }]
  }))
  const edges = Object.values(packages).reduce<[string, string][]>((acc, { config, dependencies }) => {
    return [
      ...acc,
      ...dependencies.map(dependencyName => [dependencyName, config.name] as [string, string])
    ]
  }, [])

  const topo = toposort(edges)

  return topo.map(name => ({
    ...packages[name],
    dependent: Object.values(packages)
      .filter(item => item.dependencies.includes(name))
      .map(item => item.config.name)
  }))
}
