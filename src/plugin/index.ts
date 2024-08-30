import Case from 'case'
import fs from 'fs'
import { join } from 'path'
import copyDir from 'recursive-copy'

import { addConstraint, getCliVersion } from './deps'
import { renderTemplates } from './render'

async function createDir(folder: string) {
  const boilerplateFolder = join(__dirname, '..', '..', 'assets', 'plugin-boilerplate')

  await fs.promises.access(boilerplateFolder)
  await fs.promises.mkdir(folder)
  await copyDir(boilerplateFolder, folder, { dot: true })
}

export async function createPlugin(name: string) {
  const lowerCaseName = name.toLowerCase()
  const pluginName = Case.capital(lowerCaseName)
  const packageName = Case.kebab(`rete ${lowerCaseName} plugin`)
  const namespace = Case.pascal(`${lowerCaseName} plugin`)
  const bundleName = Case.kebab(`${lowerCaseName} plugin`)
  const folderName = packageName
  const id = Case.kebab(lowerCaseName)
  const cliVersion = addConstraint('^', getCliVersion())

  await createDir(folderName)
  renderTemplates(folderName, {
    pluginName,
    packageName,
    namespace,
    bundleName,
    folderName,
    cliVersion,
    id
  })
}

