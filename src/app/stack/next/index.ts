import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'

export class NextBuilder implements AppBuilder {
  public name = 'Next.js'
  public versions = [18, 19]
  public foundation = 'react' as const

  public async create(name: string, version: number) {
    if (version === 18) {
      await execa('npx', [
        'create-next-app@14', name,
        '--ts', '--src-dir', '--no-eslint', '--no-tailwind', '--app', '--import-alias', '@/*'
      ], { stdio: 'inherit' })

      const eslintConfigName = '.eslintrc.json'

      await fse.copy(join(assetsStack, 'next', eslintConfigName), join(name, eslintConfigName), { overwrite: true })
      return
    }

    if (version === 19) {
      await execa('npx', [
        'create-next-app@16', name,
        '--ts', '--src-dir', '--no-linter', '--no-agents-md', '--use-npm', '--yes',
        '--app', '--import-alias', '@/*', '--no-tailwind'
      ], { stdio: 'inherit' })
      return
    }

    throw new Error('Unsupported version')
  }

  async putAssets(name: string) {
    const modules = join(assetsStack, 'next', 'modules')
    const customization = join(assetsStack, 'react', 'modules', 'vite', 'customization')
    const src = join(name, 'src')

    await fse.copy(assetsCommon, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(modules, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(customization, join(src, 'customization'), {
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
