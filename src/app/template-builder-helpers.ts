import fs from 'fs'

import { TemplateBuilder } from './template-builder'

export class FileTemplate<K extends string> {
  constructor(private readonly template: TemplateBuilder<K>) {}

  async apply(modules: string[], format = true) {
    for (const module of modules) {
      const file = await fs.promises.readFile(module, { encoding: 'utf-8' })

      await fs.promises.writeFile(module, await this.template.build(file, format))
    }
  }
}
