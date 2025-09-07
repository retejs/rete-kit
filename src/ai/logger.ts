import chalk from 'chalk'

export const logger = {
  warn(message: string): void {
    console.log(chalk.bgYellow(' WARN '), chalk.yellow(message))
  },

  info(message: string): void {
    console.log(chalk.bgGreen(' INFO '), chalk.green(message))
  },

  ready(message: string): void {
    console.log(chalk.bgGreen(' READY '), chalk.green(message))
  },

  skip(message: string): void {
    console.log(chalk.bgYellow(' SKIP '), chalk.yellow(message))
  }
}
