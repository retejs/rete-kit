import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { templateAssets } from '../vue/helpers'

export class NuxtBuilder implements AppBuilder {
  public name = 'Nuxt'
  public versions = [3, 4]
  public foundation = 'vue' as const
  private appVersion = 3

  public async create(name: string, version: number) {
    const template = version === 4 ? 'v4' : 'v3'

    await execa('npx', [
      'nuxi@3', 'init', name, '--template', template,
      '--packageManager', 'npm', '--gitInit'
    ], { stdio: 'inherit' })
  }

  private getAppRoot(name: string, version: number) {
    return version === 4 ? join(name, 'app') : name
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void> {
    this.appVersion = version
    const modules = join(assetsStack, 'nuxt', version === 4 ? 'modules-v4' : 'modules')
    const customization = join(assetsStack, 'vue', 'modules', 'vite', 'customization')
    const src = this.getAppRoot(name, version)

    await fse.copy(assetsCommon, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(modules, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(customization, join(src, 'customization'), {
      recursive: true,
      overwrite: true
    })
    await templateAssets(src, template)
  }

  async putScript(name: string, path: string, code: string) {
    const reteRoot = this.appVersion === 4 ? join(name, 'app', 'rete') : join(name, 'rete')
    const scriptPath = join(reteRoot, path)

    await fs.promises.mkdir(dirname(scriptPath), { recursive: true })
    await fs.promises.writeFile(scriptPath, code)
  }

  getStaticPath() {
    return join('.output', 'public')
  }

  getBuildCommand(): string {
    return 'generate'
  }
}
