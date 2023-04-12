/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import { join } from 'path'
import prettier from 'prettier'

export const defaultTemplatePath = join(__dirname, '..', '..', 'assets', 'app', 'template_ts')
export const defaultTemplateKeys = [
  'zoom-at', 'react-render', 'react18', 'vue-render', 'vue2', 'angular-render',
  'angular12', 'angular13', 'angular14', 'angular15',
  'dataflow', 'arrange', 'readonly', 'order-nodes', 'selectable',
  'context-menu'
] as const

export type DefaultTemplateKey = (typeof defaultTemplateKeys)[number]

export class TemplateBuilder {
  blockCommentRegex = /\/\* \[(!?[\w-]+)\][\n ]+(.*?)?[\n ]?\[\/\1\] \*\//gs

  async load(path: string) {
    return fs.promises.readFile(path, { encoding: 'utf-8' })
  }

  async loadDefault() {
    return this.load(defaultTemplatePath)
  }

  private replace<Keys extends string>(code: string, keep: (key: Keys) => boolean) {
    return code.replace(this.blockCommentRegex, (_substring, key, content) => {
      if (keep(key)) return this.replace(content, keep)
      if (key.startsWith('!') && !keep(key.split('!')[1])) return this.replace(content, keep)
      return ''
    })
  }

  async build<Keys extends string>(code: string, keep: (key: Keys) => boolean) {
    return prettier.format(this.replace(code, keep), { singleQuote: true, parser: 'typescript' })
  }
}
