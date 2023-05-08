import decomment from 'decomment'
import { readFile, writeJSON } from 'fs-extra'
import { join } from 'path'

export async function getTSConfig(folder: string) {
  const path = join(folder, 'tsconfig.json')

  return JSON.parse(decomment(await readFile(path, { encoding: 'utf-8' })))
}

export async function setTSConfig<T extends object>(folder: string, data: T) {
  const path = join(folder, 'tsconfig.json')

  await writeJSON(path, data, { spaces: 2 })
}
