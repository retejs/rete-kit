/* eslint-disable @typescript-eslint/naming-convention */
import chalk from 'chalk'
import execa from 'execa'

import { getPackageConfig, setPackageConfig } from '../../../shared/npm'
import { getTSConfig, setTSConfig } from '../../../shared/ts-config'
import { AngularTSConfig } from './types'

export async function installCompatibleTS(path: string, version: string) {
  console.log(chalk.bgGreen(' INFO '), chalk.green(`Enforcing the installation of TypeScript ${version} for the specified Angular version (adding "overrides" and "disableTypeScriptVersionCheck")`))

  const config = await getPackageConfig(path)
  const tsOverride = {
    typescript: `^${version}`
  }

  config.overrides = {
    '@angular-devkit/build-angular': tsOverride,
    '@angular/compiler-cli': tsOverride
  }

  await setPackageConfig(path, config)
  await execa('npm', ['i', `typescript@${version}`], { cwd: path })

  const tsConfig = await getTSConfig<AngularTSConfig>(path)

  tsConfig.angularCompilerOptions.disableTypeScriptVersionCheck = true

  await setTSConfig(path, tsConfig)
}
