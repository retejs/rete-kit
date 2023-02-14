import chalk from 'chalk'

export function throwError(message: string) {
  console.warn(chalk.red(message))
  process.exit(1)
}
