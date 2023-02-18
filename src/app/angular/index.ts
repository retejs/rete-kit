import execa from 'execa'

import { AppBuilder } from '../app-builder'

export class AngularBuilder implements AppBuilder {
  public name = 'Angular'
  public versions = [12, 13, 14, 15]

  public async create(name: string, version: number) {
    await execa('npx', ['--package', `@angular/cli@${version}`, 'ng', 'new', name], { stdio: 'inherit' })
  }

  async putScript(name: string, code: string): Promise<void> {
    name
    code
  }
}
