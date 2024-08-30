import fse from 'fs-extra'
import { join } from 'path'

export async function removeBudgets(name: string) {
  const config = await fse.readJSON(join(name, 'angular.json'))

  config.projects[name].architect.build.configurations.production.budgets = []

  await fse.writeJSON(join(name, 'angular.json'), config, { spaces: 2 })
}
