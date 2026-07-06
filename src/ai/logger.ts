import chalk from 'chalk'

export const logger = {
  warn(message: string): void {
    console.log(chalk.bgYellow(' WARN '), chalk.yellow(message))
  },

  ready(message: string): void {
    console.log(chalk.bgGreen(' READY '), chalk.green(message))
  }
}
