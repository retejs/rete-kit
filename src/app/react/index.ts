/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'
import fs from 'fs'
import { join } from 'path'

import { assets } from '../../consts'
import { select } from '../../shared/inquirer'
import { AppBuilder } from '../app-builder'
import { DefaultTemplateKey, defaultTemplateKeys, TemplateBuilder } from '../template-builder'

export class ReactBuilder implements AppBuilder {
  public name = 'React.js'
  public versions = [16, 17, 18]

  // eslint-disable-next-line max-statements
  public async create(name: string, version: number) {
    const cwd = process.cwd()

    // await execa('npx', ['create-react-app', '--template', 'typescript', name], { stdio: 'inherit' })
    // await execa('npm', ['--prefix', name, 'i', `react@${version}`, `react-dom@${version}`], { stdio: 'inherit' })

    if (version < 18) {
      const assetIndexScript = join(assets, 'app', 'react', 'index_tsx')
      const appIndexScript = join(name, 'src', 'index.tsx')

      await fs.promises.copyFile(assetIndexScript, appIndexScript)
    }

    // TODO refactor for any stack/framework
    const features = await select('Select features', defaultTemplateKeys.map(key => ({
      name: key,
      value: key
    })), true)

    const requiredDeps: Record<DefaultTemplateKey, string[]> = {
      'angular-render': [
        join(cwd, '../render-utils/dist/package.tgz'),
        join(cwd, '../vue-render-plugin/dist/package.tgz')
      ],
      'order-nodes': [],
      'react-render': [
        join(cwd, '../render-utils/dist/package.tgz'),
        join(cwd, '../react-render-plugin/dist/package.tgz'),
        'styled-components'
      ],
      'vue-render': [
        join(cwd, '../render-utils/dist/package.tgz'),
        join(cwd, '../vue-render-plugin/dist/package.tgz')
      ],
      'zoom-at': [],
      'arrange': [
        'elkjs',
        'web-worker',
        join(cwd, '../auto-arrange-plugin/dist/package.tgz')
      ],
      dataflow: [
        join(cwd, '../engine/dist/package.tgz')
      ],
      readonly: [
        join(cwd, '../readonly-plugin/dist/package.tgz')
      ],
      selectable: []
    }

    const deps = [
      join(cwd, '../rete/dist/package.tgz'),
      join(cwd, '../area-plugin/dist/package.tgz'),
      join(cwd, '../connection-plugin/dist/package.tgz'),
      ...features.map(key => requiredDeps[key]).flat()
    ]

    await execa('npm', ['--prefix', name, 'i', ...deps], { stdio: 'inherit' })

    const template = new TemplateBuilder()
    const code = await template.loadDefault()
    const newCode = await template.build<DefaultTemplateKey>(code, key => features.includes(key))

    const reteScriptPath = join(name, 'src', 'rete.ts')

    await fs.promises.writeFile(reteScriptPath, newCode)
  }
}
