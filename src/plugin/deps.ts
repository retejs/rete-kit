export function addConstraint(target: '~' | '^', constraint: string) {
  return constraint.replace(/^[^~]/, target)
}

export function getCliVersion() {
  const { dependencies, devDependencies }: {
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
  } = require('../../package.json')
  const constraint = dependencies['rete-cli'] || devDependencies['rete-cli']

  return constraint
}
