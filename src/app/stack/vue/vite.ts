import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'

export class VueViteBuilder implements AppBuilder {
  public name = 'Vue.js Vite'
  public versions = [2, 3]
  public foundation = 'vue' as const

  public async create(name: string, version: number) {
    await execa('npm', ['create', `vue@${version}`, name, '--ts'], { stdio: 'inherit' })
    await execa('npm', ['--prefix', name, 'i'], { stdio: 'inherit' })
  }

  async putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void> {
    const assets = join(assetsStack, 'vue', 'modules', 'vite')
    const src = join(name, 'src')

    await fse.copy(assets, src, {
      recursive: true,
      overwrite: true
    })
    if (version === 2) {
      const appFile = await fs.promises.readFile(join(src, 'App.vue'), { encoding: 'utf-8' })

      await fs.promises.writeFile(join(src, 'App.vue'), appFile.replace(/<!--(.*)-->/g, '$1'))
    }
    const customNodePath = join(src, 'customization', 'CustomNode.vue')
    const customNodeContent = await fs.promises.readFile(customNodePath, { encoding: 'utf-8' })

    await fs.promises.writeFile(customNodePath, await template.build(customNodeContent, false))
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
