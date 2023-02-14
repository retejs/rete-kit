import chalk from 'chalk'
import inquirer from 'inquirer'

import { Package } from '../scan'

export async function choosePackages(list: Package[]): Promise<Package[]> {
  const { packages } = await inquirer.prompt<{ packages: Package[] }>([
    {
      type: 'checkbox',
      message: 'Select packages',
      name: 'packages',
      choices: list.map(item => ({ name: `${item.folder} (${chalk.green(item.name)})`, value: item, checked: true }))
    }
  ])

  return packages
}

export async function input(message: string): Promise<string> {
  const { text } = await inquirer.prompt<{ text: string }>([
    {
      type: 'input',
      message,
      name: 'text'
    }
  ])

  return text
}

