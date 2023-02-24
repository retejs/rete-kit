import execa from 'execa'
import fs from 'fs'
import { join } from 'path'

import { assets as assetsRoot } from '../../consts'
import { VueBuilder } from './legacy'

export class VueViteBuilder extends VueBuilder {
  public name = 'Vue.js Vite'

  public async create(name: string, version: number) {
    const assets = join(assetsRoot, 'app', 'vue')
    const src = join(name, 'src')

    await execa('npm', ['create', `vue@${version}`, name, '--ts'], { stdio: 'inherit' })
    await execa('npm', ['--prefix', name, 'i'], { stdio: 'inherit' })
    await fs.promises.copyFile(join(assets, 'tsconfig_json'), join(name, 'tsconfig.json'))
    await fs.promises.copyFile(join(assets, 'App_vite_vue'), join(src, 'App.vue'))

    if (version === 2) {
      const appFile = await fs.promises.readFile(join(src, 'App.vue'), { encoding: 'utf-8' })

      await fs.promises.writeFile(join(src, 'App.vue'), appFile.replace(/<!--(.*)-->/g, '$1'))
    }
  }

  getStaticPath() {
    return 'dist'
  }
}
