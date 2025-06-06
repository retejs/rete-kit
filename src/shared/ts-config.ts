import decomment from 'decomment'
import { readFile, writeJSON } from 'fs-extra'
import { join } from 'path'

export type TSConfig = {
  compilerOptions: {
    preserveValueImports?: boolean
    importsNotUsedAsValues?: 'remove' | 'preserve' | 'error'
    verbatimModuleSyntax?: boolean
    allowJs?: boolean
    jsx?: string
  }
}

export async function getTSConfig<T extends TSConfig>(folder: string, name = 'tsconfig.json'): Promise<T> {
  const path = join(folder, name)

  return JSON.parse(decomment(await readFile(path, { encoding: 'utf-8' })))
}

export async function setTSConfig(folder: string, data: TSConfig, name = 'tsconfig.json') {
  const path = join(folder, name)

  await writeJSON(path, data, { spaces: 2 })
}
