import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsCommon, assetsStack } from '../../consts'

export class ReactViteBuilder implements AppBuilder {
  public name = 'React.js Vite'
  public versions = [16, 17, 18, 19]
  public foundation = 'react' as const

  public async create(name: string, version: number) {
    await execa('npm', ['create', 'vite@7', name, '--', '--template', 'react-ts'], { stdio: 'inherit' })
    await execa('npm', [
      'i',
      `react@${version}`,
      `react-dom@${version}`,
      `@types/react@${version}`,
      `@types/react-dom@${version}`
    ], { stdio: 'inherit', cwd: name })
  }

  async putAssets(name: string, version: number) {
    const modules = join(assetsStack, 'react', 'modules', 'vite')
    const src = join(name, 'src')

    await fse.copy(assetsCommon, src, {
      recursive: true,
      overwrite: true
    })
    await fse.copy(modules, src, {
      recursive: true,
      overwrite: true,
      filter(source) {
        if (source.endsWith('main.tsx')) return version < 18
        return true
      }
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
