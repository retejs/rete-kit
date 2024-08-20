import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'

export class LitViteBuilder implements AppBuilder {
  public name = 'Lit.js Vite'
  public versions = [3]
  public foundation = 'lit' as const

  public async create(name: string, version: number) {
    await execa('npm', [
      'create', `vite@latest`, name, '--', '--template', 'vanilla-ts', '-y'
    ], { stdio: 'inherit' })
    await execa('npm', [
      'i',
      `lit@${version}`
    ], {
      cwd: join(process.cwd(), name),
      stdio: 'inherit'
    })
  }

  async putAssets(name: string) {
    const modules = join(assetsStack, 'lit', 'modules')
    const src = join(name, 'src')

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
    return 'dist'
  }

  getBuildCommand(): string {
    return 'build'
  }
}
