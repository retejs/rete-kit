import { join } from 'path'

interface ToolsSet {
  create: {
    version: string
    flags?: string[]
  }
  kit: {
    version: string
  }
  config?: {
    path?: string
  }
  adapter: {
    version: string
  }
}

const legacy: ToolsSet = {
  create: {
    version: '4'
  },
  kit: {
    version: '1'
  },
  adapter: {
    version: '2'
  }
}

const tools: Record<`v${number}`, ToolsSet> = {
  v5: {
    create: {
      version: '6',
      flags: ['--svelte5']
    },
    kit: {
      version: '2'
    },
    config: {
      path: '5'
    },
    adapter: {
      version: '3'
    }
  },
  v4: legacy,
  v3: legacy
}

export function getToolsFor(version: number) {
  return tools[`v${version}`]
}

export function getConfigFor(version: number) {
  const name = 'svelte.config.js'
  const path = version === 5
    ? '5'
    : '.'

  return {
    source: join(path, name),
    name
  }
}
