/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'
import fs from 'fs'
import fse from 'fs-extra'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'

export class ReactBuilder implements AppBuilder {
  public name = 'React.js'
  public versions = [16, 17, 18]
  public foundation = 'react'

  public async create(name: string, version: number) {
    await execa('npx', ['create-react-app', '--template', 'typescript', name], { stdio: 'inherit' })
    await execa('npm', [
      '--prefix', name, 'i',
      `react@${version}`,
      `react-dom@${version}`,
      version < 18 ? `@testing-library/react@12` : `@testing-library/react@13`
    ], { stdio: 'inherit' })
  }

  async putAssets(name: string, version: number) {
    const modules = join(assetsStack, 'react', 'modules')
    const src = join(name, 'src')

    await fse.copy(modules, src, {
      recursive: true,
      overwrite: true,
      filter(source) {
        if (source.endsWith('index.tsx')) return version < 18
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
    return 'build'
  }
}
