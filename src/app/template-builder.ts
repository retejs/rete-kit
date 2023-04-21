/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import { join } from 'path'
import prettier from 'prettier'

import { assets as assetsRoot } from '../consts'

export const templatesPath = join(assetsRoot, 'app', 'templates')
export const entryScriptPath = join(assetsRoot, 'app', 'entry_ts')
export type DefaultTemplateKey = 'zoom-at' | 'react-render' | 'react18' | 'vue-render'
  | 'vue2' | 'angular-render' | 'angular12' | 'angular13' | 'angular14' | 'angular15'
  | 'dataflow' | 'arrange' | 'readonly' | 'order-nodes' | 'selectable'
  | 'context-menu' | 'import-area-extensions' | `stack-${string}`

export class TemplateBuilder<Key extends string> {
  blockCommentRegex = /\/\* \[(!?[\w-]+)\][\n ]+(.*?)?[\n ]?\[\/\1\] \*\//gs

  constructor(private keys: Key[]) {}

  async load(name: string) {
    return fs.promises.readFile(join(templatesPath, name), { encoding: 'utf-8' })
  }

  async getTemplates() {
    return fs.promises.readdir(templatesPath)
  }

  private replace(code: string, keep: (key: Key) => boolean) {
    return code.replace(this.blockCommentRegex, (_substring, key, content) => {
      if (keep(key)) return this.replace(content, keep)
      if (key.startsWith('!') && !keep(key.split('!')[1])) return this.replace(content, keep)
      return ''
    })
  }

  async build(code: string) {
    const keep = (key: Key) => this.keys.includes(key)

    return prettier.format(this.replace(code, keep), { singleQuote: true, parser: 'typescript' })
  }

  async getEntryScript() {
    return fs.promises.readFile(entryScriptPath, { encoding: 'utf-8' })
  }
}
