/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'
import fs from 'fs'
import { join } from 'path'

import { assets as assetsRoot } from '../../consts'
import { AppBuilder } from '../app-builder'

export class ReactBuilder implements AppBuilder {
  public name = 'React.js'
  public versions = [16, 17, 18]

  public async create(name: string, version: number) {
    const assets = join(assetsRoot, 'app', 'react')
    const src = join(name, 'src')

    await execa('npx', ['create-react-app', '--template', 'typescript', name], { stdio: 'inherit' })
    await execa('npm', ['--prefix', name, 'i', `react@${version}`, `react-dom@${version}`], { stdio: 'inherit' })

    if (version < 18) await fs.promises.copyFile(join(assets, 'index_tsx'), join(src, 'index.tsx'))
    await fs.promises.copyFile(join(assets, 'rete_css'), join(src, 'rete.css'))
    await fs.promises.copyFile(join(assets, 'App_tsx'), join(src, 'App.tsx'))
  }

  async putScript(name: string, code: string) {
    const reteScriptPath = join(name, 'src', 'rete.ts')

    await fs.promises.writeFile(reteScriptPath, code)
  }

  getStaticPath() {
    return 'build'
  }
}
