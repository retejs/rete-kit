import execa from 'execa'
import fs from 'fs'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'

export class VueBuilder implements AppBuilder {
  public name = 'Vue.js'
  public versions = [2, 3]

  public async create(name: string, version: number) {
    const assets = join(assetsStack, 'vue')
    const src = join(name, 'src')
    const presetFolder = join(assets, version === 2 ? 'vue2' : 'vue3')

    await execa('npx', ['--package', `@vue/cli@`, 'vue', 'create', name, '--preset', presetFolder], { stdio: 'inherit' })
    await fs.promises.copyFile(join(assets, 'App_vue'), join(src, 'App.vue'))
  }

  async putScript(name: string, path: string, code: string): Promise<void> {
    const scriptPath = join(name, 'src', 'rete', path)

    await fs.promises.mkdir(dirname(scriptPath), { recursive: true })
    await fs.promises.writeFile(scriptPath, code)
  }

  getStaticPath() {
    return 'dist'
  }
}
