import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { templateAssets } from '../vue/helpers'

export class NuxtBuilder implements AppBuilder {
  public name = 'Nuxt'
  public versions = [3]
  public foundation = 'vue' as const

  public async create(name: string) {
    await execa('npx', ['nuxi@3', 'init', name, '--packageManager', 'npm', '--gitInit'], { stdio: 'inherit' })
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async putAssets<K extends string>(name: string, _version: number, template: TemplateBuilder<K>): Promise<void> {
    const modules = join(assetsStack, 'nuxt', 'modules')
    const customization = join(assetsStack, 'vue', 'modules', 'vite', 'customization')
    const src = join(name)

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
    const scriptPath = join(name, 'rete', path)

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
