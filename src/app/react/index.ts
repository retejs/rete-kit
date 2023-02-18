/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'
import fs from 'fs'
import { join } from 'path'

import { assets } from '../../consts'
import { AppBuilder } from '../app-builder'

export class ReactBuilder implements AppBuilder {
  public name = 'React.js'
  public versions = [16, 17, 18]

  // eslint-disable-next-line max-statements
  public async create(name: string, version: number) {
    await execa('npx', ['create-react-app', '--template', 'typescript', name], { stdio: 'inherit' })
    await execa('npm', ['--prefix', name, 'i', `react@${version}`, `react-dom@${version}`], { stdio: 'inherit' })

    if (version < 18) {
      const assetIndexScript = join(assets, 'app', 'react', 'index_tsx')
      const appIndexScript = join(name, 'src', 'index.tsx')

      await fs.promises.copyFile(assetIndexScript, appIndexScript)
    }
  }

  async putScript(name: string, code: string) {
    const reteScriptPath = join(name, 'src', 'rete.ts')

    await fs.promises.writeFile(reteScriptPath, code)
  }
}
