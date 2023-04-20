import execa from 'execa'
import fs from 'fs'
import { join } from 'path'

import { AppBuilder } from '../../app-builder'
import { assetsStack } from '../../consts'

export class AngularBuilder implements AppBuilder {
  public name = 'Angular'
  public versions = [12, 13, 14, 15]

  public async create(name: string, version: number) {
    const assets = join(assetsStack, 'angular')
    const src = join(name, 'src')

    await execa('npx', ['--package', `@angular/cli@${version}`, 'ng', 'new', name, '--defaults'], { stdio: 'inherit' })

    await fs.promises.copyFile(join(assets, 'app.component_html'), join(src, 'app', 'app.component.html'))
    await fs.promises.copyFile(join(assets, 'app.component_ts'), join(src, 'app', 'app.component.ts'))
  }

  async putScript(name: string, code: string): Promise<void> {
    const reteScriptPath = join(name, 'src', 'app', 'rete.ts')

    await fs.promises.writeFile(reteScriptPath, code)
  }

  getStaticPath(name: string) {
    return join('dist', name)
  }
}
