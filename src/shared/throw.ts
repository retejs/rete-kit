import chalk from 'chalk'

export function throwError(message: string) {
  console.warn(chalk.red(message.replace(/( {1,})/g, ' ').replace(/^ /, '')))
  process.exit(1)
}
