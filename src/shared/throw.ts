import chalk from 'chalk'

export function throwError(message: string) {
  const label = chalk.black.bgRgb(220, 50, 50)(' FAIL ')

  console.warn('\n', label, chalk.red(message.replace(/( {1,})/g, ' ').replace(/^ /, '')))
  process.exit(1)
}
