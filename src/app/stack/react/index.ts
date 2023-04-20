/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'
import fs from 'fs'
import { dirname, join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'

export class ReactBuilder implements AppBuilder {
  public name = 'React.js'
  public versions = [16, 17, 18]

  public async create(name: string, version: number) {
    const assets = join(assetsStack, 'react')
    const src = join(name, 'src')

    await execa('npx', ['create-react-app', '--template', 'typescript', name], { stdio: 'inherit' })
    await execa('npm', [
      '--prefix', name, 'i',
      `react@${version}`,
      `react-dom@${version}`,
      version < 18 ? `@testing-library/react@12` : `@testing-library/react@13`
    ], { stdio: 'inherit' })

    if (version < 18) await fs.promises.copyFile(join(assets, 'index_tsx'), join(src, 'index.tsx'))
    await fs.promises.copyFile(join(assets, 'rete_css'), join(src, 'rete.css'))
    await fs.promises.copyFile(join(assets, 'App_tsx'), join(src, 'App.tsx'))
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
