import execa from 'execa'
import fs from 'fs'
import { join } from 'path'

import { assets as assetsRoot } from '../../consts'
import { select } from '../../shared/inquirer'
import { AppBuilder } from '../app-builder'

export class VueBuilder implements AppBuilder {
  public name = 'Vue.js'
  public versions = [2, 3]

  // eslint-disable-next-line max-statements
  public async create(name: string, version: number) {
    const assets = join(assetsRoot, 'app', 'vue')
    const src = join(name, 'src')

    const bundler = await select('Bundler', [
      {
        name: 'Vite',
        value: 'vite' as const
      },
      {
        name: 'Webpack',
        value: 'webpack' as const
      }
    ])

    if (bundler === 'vite') {
      await execa('npm', ['create', `vue@${version}`, name, '--ts'], { stdio: 'inherit' })
      await execa('npm', ['--prefix', name, 'i'], { stdio: 'inherit' })
      await fs.promises.copyFile(join(assets, 'tsconfig_json'), join(name, 'tsconfig.json'))
      await fs.promises.copyFile(join(assets, 'App_vite_vue'), join(src, 'App.vue'))

      if (version === 2) {
        const appFile = await fs.promises.readFile(join(src, 'App.vue'), { encoding: 'utf-8' })

        await fs.promises.writeFile(join(src, 'App.vue'), appFile.replace(/<!--(.*)-->/g, '$1'))
      }
    } else {
      const presetFolder = join(assets, version === 2 ? 'vue2' : 'vue3')

      await execa('npx', ['--package', `@vue/cli@`, 'vue', 'create', name, '--preset', presetFolder], { stdio: 'inherit' })
      await fs.promises.copyFile(join(assets, 'App_vue'), join(src, 'App.vue'))
    }
  }

  async putScript(name: string, code: string): Promise<void> {
    const reteScriptPath = join(name, 'src', 'rete.ts')

    await fs.promises.writeFile(reteScriptPath, code)
  }
}
