/* eslint-disable @typescript-eslint/naming-convention */
import execa from 'execa'

type Events = {
  log: (line: string) => void
  error: (line: string) => void
  resolveOn: (line: string) => boolean
}

export async function awaitedExec(command: string, args: string[], options: { cwd?: string }, events: Events) {
  const execaInstance = execa(command, args, { env: { FORCE_COLOR: 'true' }, ...options })

  await new Promise<void>((resolve, reject) => {
    execaInstance.stdout?.addListener('data', (chunk: Buffer) => {
      const str = chunk.toString()

      if (!str) return
      const lines = str.trim().split('\n')

      lines.forEach(events.log)

      if (lines.some(events.resolveOn)) resolve()
    })
    execaInstance.stderr?.addListener('data', (chunk: Buffer) => {
      const str = chunk.toString()

      if (!str) return
      const lines = str.trim().split('\n')

      lines.forEach(events.error)
    })

    // reject on exit code !== 0
    void execaInstance.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}
