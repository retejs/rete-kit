import { readJSON, writeJSON } from 'fs-extra'
import { join } from 'path'

export async function getPackageConfig(folder: string) {
  const path = join(folder, 'package.json')

  return readJSON(path)
}

export async function setPackageConfig<T extends object>(folder: string, data: T) {
  const path = join(folder, 'package.json')

  await writeJSON(path, data, { spaces: 2 })
}
