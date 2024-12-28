import { default as execa, Options } from 'execa'

export const exec = async (file: string, args?: readonly string[], options?: Options) => {
  if (process.env.VERBOSE) {
    console.log(`exec: ${file} ${args?.join(' ')}`)
  }
  return execa(file, args, options)
}
