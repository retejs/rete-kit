import execa from 'execa'

export async function install(cwd: string, dependencies: string[]) {
  await execa('npm', ['--prefix', cwd, 'i', ...dependencies], { stdio: 'inherit' })
}
