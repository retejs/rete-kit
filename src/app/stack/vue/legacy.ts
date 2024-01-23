import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { templateAssets } from './helpers'

export class VueBuilder implements AppBuilder {
  public name = 'Vue.js'
  public versions = [2, 3]
  public foundation = 'vue' as const

  public async create(name: string, version: number) {
    const assets = join(assetsStack, 'vue')
    const presetFolder = join(assets, version === 2 ? 'vue2' : 'vue3')

    await execa('npx', ['--package', `@vue/cli@`, 'vue', 'create', name, '--preset', presetFolder], { stdio: 'inherit' })
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async putAssets<K extends string>(name: string, _: number, template: TemplateBuilder<K>): Promise<void> {
    const assets = join(assetsStack, 'vue', 'modules', 'legacy')
    const src = join(name, 'src')

    await fse.copy(assets, src, {
      recursive: true,
      overwrite: true
    })

    await templateAssets(src, template)
  }

  async putScript(name: string, path: string, code: string): Promise<void> {
    const scriptPath = join(name, 'src', 'rete', path)

    await fs.promises.mkdir(dirname(scriptPath), { recursive: true })
    await fs.promises.writeFile(scriptPath, code)
  }

  getStaticPath() {
    return 'dist'
  }

  getBuildCommand(): string {
    return 'build'
  }
}
