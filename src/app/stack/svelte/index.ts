import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { exec } from '../../../shared/exec'
import { getTSConfig, setTSConfig } from '../../../shared/ts-config'
import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'
import { TemplateBuilder } from '../../template-builder'
import { FileTemplate } from '../../template-builder-helpers'
import { getConfigFor, getToolsFor } from './compatibility'

export type SvelteVersion = 3 | 4 | 5

export class SvelteBuilder implements AppBuilder {
  public name = 'Svelte'
  public versions: SvelteVersion[] = [3, 4, 5]
  public foundation = 'svelte' as const

  public async create(name: string, version: number) {
    const tools = getToolsFor(version)

    await exec('npm', [
      'create', `svelte-with-args@${tools.create.version}`, '-y',
      '--',
      '--name', name,
      '--template', 'default',
      '--types', 'typescript',
      '--no-prettier', '--no-eslint', '--no-playwright', '--no-vitest',
      ...tools.create.flags ?? []
    ], { stdio: 'inherit' })
    await exec('npm', ['i'], { cwd: join(process.cwd(), name), stdio: 'inherit' })

    const tsConfig = await getTSConfig(name)

    tsConfig.compilerOptions.preserveValueImports = false
    tsConfig.compilerOptions.importsNotUsedAsValues = 'preserve'
    tsConfig.compilerOptions.verbatimModuleSyntax = false

    await setTSConfig(name, tsConfig)

    await exec('npm', [
      'i',
      `svelte@${version}`,
      `@sveltejs/kit@${tools.kit.version}`
    ], { stdio: 'inherit', cwd: name })

    const { name: configName, source } = getConfigFor(version)

    await fse.copy(join(assetsStack, 'svelte', source), join(name, configName), { overwrite: true })
    await exec('npm', ['i', `@sveltejs/adapter-static@${tools.adapter.version}`], { stdio: 'inherit', cwd: name })
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async putAssets<K extends string>(name: string, _version: number, template: TemplateBuilder<K>) {
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

    const fileTemplate = new FileTemplate(template)

    await fileTemplate.apply([
      join(src, 'customization', 'CustomConnection.svelte'),
      join(src, 'customization', 'CustomNode.svelte')
    ], false)
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
