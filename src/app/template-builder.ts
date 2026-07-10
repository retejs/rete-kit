/* eslint-disable @typescript-eslint/naming-convention */
import Case from 'case'
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
  | 'context-menu' | 'import-area-extensions' | 'minimap' | 'reroute' | 'history' | 'comments'
  | `stack-${string}`

function toCreateEditorName(id: string) {
  return `create${Case.pascal(id)}Editor`
}

export class TemplateBuilder<Key extends string> {
  blockCommentRegex = /\/\* \[(!?[\w-]+)\][\r\n ]+(.*?)?[\r\n ]?\[\/\1\] \*\//gs

  constructor(private keys: Key[]) { }

  private normalizeLineEndings(code: string) {
    return code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  }

  async load(name: string) {
    return this.normalizeLineEndings(await fs.promises.readFile(join(templatesPath, name), { encoding: 'utf-8' }))
  }

  static getTemplates() {
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
    const code = this.replace(this.normalizeLineEndings(template), keep)

    return format
      ? prettier.format(code, { singleQuote: true, parser: 'typescript' })
      : code
  }

  async getEntryScript(templateIds: string[] = []) {
    const template = this.normalizeLineEndings(await fs.promises.readFile(entryScriptPath, { encoding: 'utf-8' }))
    const imports = templateIds
      .map(id => `import { createEditor as ${toCreateEditorName(id)} } from './${id}'`)
      .join('\n')
    const factoryEntries = templateIds
      .map(id => `  ,'${id}': ${toCreateEditorName(id)}`)
      .join('\n')

    return template
      .replace('/* {{virtual-imports}} */', imports)
      .replace('/* {{virtual-factory}} */', factoryEntries)
  }
}
