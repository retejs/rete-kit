import chalk from 'chalk'
import fs from 'fs'
import { join } from 'path'

import { throwError } from '../shared/throw'

const patchDescriptor = '.rete-patch'

type Descriptor = {
  stack: string
  version: number
}

async function exists(name: string) {
  try {
    await fs.promises.access(name)
    return true
  } catch (e) {
    return false
  }
}

async function validateDescriptor(path: string, expected: Descriptor): Promise<{ issue: null | string }> {
  const descriptor: Descriptor = JSON.parse(await fs.promises.readFile(path, { encoding: 'utf-8' }))

  if (descriptor.stack !== expected.stack) {
    return {
      issue: `\
        Stack mismatch \
        ("${descriptor.stack}" in the target directory instead of the expected "${expected.stack}")\
      `
    }
  }
  if (descriptor.version !== expected.version) {
    return {
      issue: `\
        Versions mismatch \
        ("${descriptor.version}" in the target directory instead of the expected "${expected.version}")\
      `
    }
  }

  return { issue: null }
}

export async function ensure(name: string, stack: string, version: number): Promise<{ exists: boolean }> {
  const folderExists = await exists(name)
  const descriptorPath = join(name, patchDescriptor)

  if (folderExists) {
    console.log('\n', chalk.bgGreen(' PATCH '), chalk.yellow('The app directory exists. Checking if it can be patched...'))
  } else {
    return { exists: false }
  }

  const descriptorExists = await exists(descriptorPath)

  if (!descriptorExists) {
    throwError(`\
      Patch descriptor (${descriptorPath}) not found.\
      Probably this app was created using an older version of Rete Kit or some other tool\
    `)
  }

  const { issue } = await validateDescriptor(descriptorPath, { stack, version })

  if (issue) throwError(issue)

  return { exists: true }
}

export async function commit(name: string, stack: string, version: number) {
  const content = JSON.stringify(<Descriptor>{ stack, version }, null, '\t')

  await fs.promises.writeFile(join(name, patchDescriptor), content)
  console.log('\n', chalk.bgGreen(' PATCH '), chalk.green('Ready'))
}
