import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { getTSConfig, setTSConfig } from '../../../shared/ts-config'
import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'

export class ViteBuilder implements AppBuilder {
  public name = 'Vite'
  public versions = [16, 17, 18]
  public foundation = 'react' as const

  public async create(name: string) {
    await execa('npm', [
      'create', `vite@latest`, name, '--', '--template', 'vanilla-ts', '-y'
    ], { stdio: 'inherit' })
    await execa('npm', ['i'], { cwd: join(process.cwd(), name), stdio: 'inherit' })

    const tsConfig = await getTSConfig(name)

    tsConfig.compilerOptions.jsx = 'react-jsx'

    await setTSConfig(name, tsConfig)
  }

  async putAssets(name: string) {
    const customization = join(assetsStack, 'react', 'modules', 'vite', 'customization')
    const assets = join(assetsStack, 'react', 'modules', 'vite', 'assets')
    const modules = join(assetsStack, 'vite', 'modules')
    const src = join(name, 'src')

    await fse.copy(customization, join(src, 'customization'), {
      recursive: true,
      overwrite: true
    })
    await fse.copy(assets, join(src, 'assets'), {
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
