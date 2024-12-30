import fs from 'fs'
import fse from 'fs-extra'
import { basename, dirname, join } from 'path'

import { exec } from '../../../shared/exec'
import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { FileTemplate } from '../../template-builder-helpers'
import { removeBudgets } from './budgets'
import { installCompatibleTS } from './compatibility'

export type AngularVersion = 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19

export class AngularBuilder implements AppBuilder {
  public name = 'Angular'
  public versions: AngularVersion[] = [12, 13, 14, 15, 16, 17, 18, 19]
  public foundation = 'angular' as const

  public async create(name: string, version: number) {
    const options = ['--defaults']

    if ([17, 18].includes(version)) options.push('--no-standalone')

    await exec('npx', ['--package', `@angular/cli@${version}`, 'ng', 'new', name, ...options], { stdio: 'inherit' })
    await exec('npx', [
      'npm-check-updates@16',
      '--upgrade',
      '--target',
      'minor',
      '--filter',
      '/@angular.*/'
    ], { stdio: 'inherit', cwd: name })
    await exec('npm', ['i'], { cwd: name })

    if (version < 13) {
      await installCompatibleTS(name, '4.7')
    }
    await removeBudgets(name)
  }

  async putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void> {
    const assets = join(assetsStack, 'angular', 'modules')
    const src = join(name, 'src')

    await fse.copy(assetsCommon, join(src, 'app'), {
      recursive: true,
      overwrite: true
    })
    await fse.promises.rename(join(src, 'app', 'customization', 'background.css'), join(src, 'styles.css'))
    await fse.copy(assets, src, {
      recursive: true,
      overwrite: true,
      filter(sourcePath) {
        if (version >= 13 && basename(sourcePath) === 'shims.d.ts') return false
        return true
      }
    })

    const fileTemplate = new FileTemplate(template)

    await fileTemplate.apply([
      join(src, 'app', 'app.module.ts'),
      join(src, 'app', 'customization', 'custom-node', 'custom-node.component.ts'),
    ])
  }

  async putScript(name: string, path: string, code: string): Promise<void> {
    const scriptPath = join(name, 'src', 'app', 'rete', path)

    await fs.promises.mkdir(dirname(scriptPath), { recursive: true })
    await fs.promises.writeFile(scriptPath, code)
  }

  getStaticPath(name: string, version?: number) {
    if (version && [17, 18, 19].includes(version)) return join('dist', name, 'browser')
    return join('dist', name)
  }

  getBuildCommand(): string {
    return 'build'
  }
}
