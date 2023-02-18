import execa from 'execa'

import { select } from '../../shared/inquirer'
import { AppBuilder } from '../app-builder'

export class VueBuilder implements AppBuilder {
  public name = 'Vue.js'
  public versions = [2, 3]

  public async create(name: string, version: number) {
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
      await execa('npm', ['create', `vue@${version}`, name], { stdio: 'inherit' })
    } else {
      const preset = version === 2 ? 'Default (Vue 2)' : 'Default (Vue 3)'

      await execa('npx', ['--package', `@vue/cli@`, 'vue', 'create', name, '--preset', preset], { stdio: 'inherit' })
    }
  }

  async putScript(name: string, code: string): Promise<void> {
    name
    code
  }
}
