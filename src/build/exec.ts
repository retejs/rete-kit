/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'

export async function awaitedExec(command: string, args: string[], log: (line: string) => void, resolveOn: (line: string) => boolean) {
  const execaInstance = execa(command, args, { env: { FORCE_COLOR: 'true' } })

  await new Promise<void>((resolve) => {
    execaInstance.stdout?.addListener('data', (chunk: Buffer) => {
      const str = chunk.toString()

      if (!str) return
      const lines = str.trim().split('\n')

      lines.forEach(log)

      if (lines.some(resolveOn)) resolve()
    })
  })
}
