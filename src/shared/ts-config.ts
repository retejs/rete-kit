import decomment from 'decomment'
import { readFile, writeJSON } from 'fs-extra'
import { join } from 'path'

export async function getTSConfig(folder: string, name = 'tsconfig.json') {
  const path = join(folder, name)

  return JSON.parse(decomment(await readFile(path, { encoding: 'utf-8' })))
}

export async function setTSConfig<T extends object>(folder: string, data: T, name = 'tsconfig.json') {
  const path = join(folder, name)

  await writeJSON(path, data, { spaces: 2 })
}
