import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { getTSConfig, setTSConfig } from '../../../shared/ts-config'
import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'

export class SvelteBuilder implements AppBuilder {
  public name = 'Svelte'
  public versions = [3, 4]
  public foundation = 'svelte' as const

  public async create(name: string, version: number) {
    await execa('npm', [
      'create', `svelte-with-args@4`, '-y',
      '--',
      '--name', name,
      '--template', 'default',
      '--types', 'typescript',
      '--no-prettier', '--no-eslint', '--no-playwright', '--no-vitest'
    ], { stdio: 'inherit' })
    await execa('npm', ['i'], { cwd: join(process.cwd(), name), stdio: 'inherit' })

    const tsConfig = await getTSConfig(name)

    tsConfig.compilerOptions.preserveValueImports = false
    tsConfig.compilerOptions.importsNotUsedAsValues = 'preserve'

    await setTSConfig(name, tsConfig)

    await execa('npm', [
      'i',
      `svelte@${version}`,
      `@sveltejs/kit@1`
    ], { stdio: 'inherit', cwd: name })

    const configName = 'svelte.config.js'

    await fse.copy(join(assetsStack, 'svelte', configName), join(name, configName), { overwrite: true })
    await execa('npm', ['i', `@sveltejs/adapter-static@2`], { stdio: 'inherit', cwd: name })
  }

  async putAssets(name: string, version: number) {
    version
    const modules = join(assetsStack, 'svelte', 'modules')
    const src = join(name, 'src')

    await fse.copy(assetsCommon, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(modules, src, {
      recursive: true,
      overwrite: true
    })
  }

  async putScript(name: string, path: string, code: string) {
    const scriptPath = join(name, 'src', 'rete', path)

    await fs.promises.mkdir(dirname(scriptPath), { recursive: true })
    await fs.promises.writeFile(scriptPath, code)
  }

  getStaticPath() {
    return 'build'
  }

  getBuildCommand(): string {
    return 'build'
  }
}
