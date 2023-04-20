import chalk from 'chalk'

export function throwError(message: string) {
  console.warn(
    '\n', chalk.black.bgRgb(220, 50, 50)(' FAIL '),
    chalk.red(message.replace(/( {1,})/g, ' ').replace(/^ /, ''))
  )
  process.exit(1)
}
