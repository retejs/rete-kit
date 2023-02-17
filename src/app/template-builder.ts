/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import { join } from 'path'
import prettier from 'prettier'

export const defaultTemplatePath = join(__dirname, '..', '..', 'assets', 'app', 'template_ts')
export const defaultTemplateKeys = [
  'zoom-at', 'react-render', 'vue-render', 'angular-render',
  'dataflow', 'arrange', 'readonly', 'order-nodes', 'selectable'
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

  async build<Keys extends string>(code: string, keep: (key: Keys) => boolean) {
    const processedCode = code.replace(this.blockCommentRegex, (_substring, key, content) => {
      if (keep(key)) return content
      if (key.startsWith('!') && !keep(key.split('!')[1])) return content
      return ''
    })

    return prettier.format(processedCode, { singleQuote: true, parser: 'typescript' })
  }
}
