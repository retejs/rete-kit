/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import { join } from 'path'
import prettier from 'prettier'

import { assets as assetsRoot } from '../consts'
import { AngularVersion } from './stack/angular'
import { SvelteVersion } from './stack/svelte'

export const templatesPath = join(assetsRoot, 'app', 'templates')
export const entryScriptPath = join(assetsRoot, 'app', 'entry_ts')
export type DefaultTemplateKey = 'zoom-at' | 'react-render' | `react${number}` | 'vue-render'
  | `vue${2 | 3}` | 'angular-render' | `angular${AngularVersion}`
  | 'svelte-render' | `svelte${SvelteVersion}` | 'lit-render' | `lit${3}`
  | 'dataflow' | 'arrange' | 'sizes' | 'readonly' | 'order-nodes' | 'selectable'
  | 'context-menu' | 'import-area-extensions' | 'minimap' | 'reroute' | `stack-${string}`

export class TemplateBuilder<Key extends string> {
  blockCommentRegex = /\/\* \[(!?[\w-]+)\][\n ]+(.*?)?[\n ]?\[\/\1\] \*\//gs

  constructor(private keys: Key[]) { }

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

  build(template: string, format = true) {
    const keep = (key: Key) => this.keys.includes(key)
    const code = this.replace(template, keep)

    return format
      ? prettier.format(code, { singleQuote: true, parser: 'typescript' })
      : code
  }

  async getEntryScript() {
    return fs.promises.readFile(entryScriptPath, { encoding: 'utf-8' })
  }
}
