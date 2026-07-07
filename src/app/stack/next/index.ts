import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'

export class NextBuilder implements AppBuilder {
  public name = 'Next.js'
  public versions = [19]
  public foundation = 'react' as const

  public async create(name: string, version: number) {
    if (version !== 19) throw new Error('Unsupported version')

    await execa('npx', [
      'create-next-app@16', name,
      '--ts', '--src-dir', '--no-linter', '--no-agents-md', '--use-npm', '--yes',
      '--app', '--import-alias', '@/*', '--no-tailwind'
    ], { stdio: 'inherit' })
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
