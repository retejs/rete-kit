import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { getTSConfig, setTSConfig } from '../../../shared/ts-config'
import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { templateAssets } from './helpers'

export class VueViteBuilder implements AppBuilder {
  public name = 'Vue.js Vite'
  public versions = [2, 3]
  public foundation = 'vue' as const

  public async create(name: string, version: number) {
    await execa('npm', ['create', `vue@${version}`, name, '--', '--ts'], { stdio: 'inherit' })
    await execa('npm', ['i'], { stdio: 'inherit', cwd: name })

    const configName = version === 3
      ? 'tsconfig.app.json'
      : 'tsconfig.json'
    const tsConfig = await getTSConfig(name, configName)

    tsConfig.compilerOptions.allowJs = true
    tsConfig.compilerOptions.preserveValueImports = false
    tsConfig.compilerOptions.importsNotUsedAsValues = 'remove'
    tsConfig.compilerOptions.verbatimModuleSyntax = false

    await setTSConfig(name, tsConfig, configName)
  }

  async putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void> {
    const assets = join(assetsStack, 'vue', 'modules', 'vite')
    const src = join(name, 'src')

    await fse.copy(assetsCommon, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(assets, src, {
      recursive: true,
      overwrite: true
    })
    if (version === 2) {
      const appFile = await fs.promises.readFile(join(src, 'App.vue'), { encoding: 'utf-8' })

      await fs.promises.writeFile(join(src, 'App.vue'), appFile.replace(/<!--(.*)-->/g, '$1'))
    }

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
