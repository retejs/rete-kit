
import fs from 'fs'

interface PackageJSON {
  name: string
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
}

function sanitizeName(name: string) {
  return name.replace(/[@/-]/g, '')
}

function defineSubgraph(id: string, deps: string[], match: (dep: string) => boolean) {
  let graphDefinition = ''

  graphDefinition += `subgraph ${id}\n`
  for (const dep of deps.filter(match)) {
    graphDefinition += `${sanitizeName(dep)}\n`
  }
  graphDefinition += `end\n`

  return graphDefinition
}

// eslint-disable-next-line max-statements
export async function getPackagesGraph(paths: string[]) {
  let graphDefinition = `
  flowchart TB
  `

  const packages: PackageJSON[] = []

  for (const f of paths) {
    packages.push(...await readPackages(f))
  }

  const names = packages.map(p => p.name)
  const ownDependencies = packages.map(pkg => filterOwnDependencies(pkg, names))

  const systemDeps = ['rete-cli', 'rete-kit', 'rete-qa']
  const renderingDeps = [
    'rete-react-plugin', 'rete-vue-plugin', 'rete-angular-plugin', 'rete-svelte-plugin', '@retejs/lit-plugin'
  ]
  const uiDeps = [
    'rete-area-plugin', 'rete-area-3d-plugin', 'rete-render-utils', 'rete-connection-plugin', 'rete-dock-plugin',
    'rete-context-menu-plugin', 'rete-comment-plugin', 'rete-auto-arrange-plugin', 'rete-scopes-plugin',
    'rete-history-plugin',
    'rete-readonly-plugin', 'rete-connection-reroute-plugin', 'rete-connection-path-plugin', 'rete-minimap-plugin'
  ]

  graphDefinition += defineSubgraph('System', names, dep => systemDeps.includes(dep))
  graphDefinition += defineSubgraph('Rendering', names, dep => renderingDeps.includes(dep))
  graphDefinition += defineSubgraph('UI', [...names, 'Rendering'], dep => [...uiDeps, 'Rendering'].includes(dep))

  for (const pkg of ownDependencies) {
    const all = Array.from(new Set([
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies
    ]))

    for (const dep of all) {
      graphDefinition += `${sanitizeName(dep)} --> ${sanitizeName(pkg.name)}\n`
    }
  }

  return graphDefinition
}

function filterOwnDependencies(pkg: PackageJSON, names: string[]) {
  const filter = (deps?: Record<string, string>) => Object.keys(deps ?? {}).filter(name => names.includes(name))

  return {
    ...pkg,
    dependencies: filter(pkg.dependencies),
    devDependencies: filter(pkg.devDependencies),
    peerDependencies: filter(pkg.peerDependencies),
    optionalDependencies: filter(pkg.optionalDependencies)
  }
}

async function readPackages(target: string) {
  const items = await fs.promises.readdir(target, { withFileTypes: true })
  const folders = items.filter(item => item.isDirectory()).map(item => item.name)
  const packages = folders
    .filter(folder => fs.existsSync(`${target}/${folder}/package.json`))
    .map(folder => {
      return JSON.parse(fs.readFileSync(`${target}/${folder}/package.json`, 'utf8')) as PackageJSON
    })
    .filter(p => p.name)

  return packages
}
