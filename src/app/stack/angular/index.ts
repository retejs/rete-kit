import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { basename, dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { removeBudgets } from './budgets'
import { installCompatibleTS } from './compatibility'

export class AngularBuilder implements AppBuilder {
  public name = 'Angular'
  public versions = [12, 13, 14, 15, 16, 17]
  public foundation = 'angular' as const

  public async create(name: string, version: number) {
    const options = ['--defaults']

    if (version === 17) options.push('--no-standalone')

    await execa('npx', ['--package', `@angular/cli@${version}`, 'ng', 'new', name, ...options], { stdio: 'inherit' })
    await execa('npx', ['npm-check-updates', '--upgrade', '--target', 'minor', '--filter', '/@angular.*/'], { stdio: 'inherit', cwd: name })
    await execa('npm', ['i'], { cwd: name })

    if (version < 13) {
      await installCompatibleTS(name, '4.7')
    }
    await removeBudgets(name)
  }

  async putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void> {
    const assets = join(assetsStack, 'angular', 'modules')
    const src = join(name, 'src')

    await fse.copy(assets, src, {
      recursive: true,
      overwrite: true,
      filter(sourcePath) {
        if (version >= 13 && basename(sourcePath) === 'shims.d.ts') return false
        return true
      }
    })

    const appModulePath = join(src, 'app', 'app.module.ts')
    const appFile = await fs.promises.readFile(appModulePath, { encoding: 'utf-8' })

    await fs.promises.writeFile(appModulePath, await template.build(appFile))
  }

  async putScript(name: string, path: string, code: string): Promise<void> {
    const scriptPath = join(name, 'src', 'app', 'rete', path)

    await fs.promises.mkdir(dirname(scriptPath), { recursive: true })
    await fs.promises.writeFile(scriptPath, code)
  }

  getStaticPath(name: string, version?: number) {
    if (version === 17) return join('dist', name, 'browser')
    return join('dist', name)
  }

  getBuildCommand(): string {
    return 'build'
  }
}
