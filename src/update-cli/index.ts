import chalk from 'chalk'
import execa from 'execa'
import { join } from 'path'

import scan from '../scan'
import { choosePackages, input } from '../shared/inquirer'

export default async function (cwd: string) {
  const packages = await scan(cwd)
  const selected = await choosePackages(packages)
  const version = await input('CLI version or label (latest, next, etc.)')

  for (const { name, folder } of selected) {
    const reference = `rete-cli@${version}`

    console.log(`Installing ${reference} for ${chalk.green(name)} in ${folder} folder`)
    await execa('npm', ['i', '-D', reference], { cwd: join(cwd, folder), stdio: 'inherit' })
    console.log(chalk.green(`${reference} has been installed for ${name}`))
  }
}
