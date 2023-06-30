import chalk from 'chalk'

import { AppStack } from '.'
import { DefaultTemplateKey } from './template-builder'

function ver(name: string, next: boolean) {
  return `${name}@${next ? 'next' : 2}`
}

export interface Feature {
  name: string
  mandatory?: boolean
  templateKeys?: DefaultTemplateKey[]
  requiredDependencies?: string[]
}

export class Default implements Feature {
  name = 'Default'
  mandatory = true
  templateKeys: DefaultTemplateKey[] = []
  requiredDependencies: string[] = []

  constructor(stack: string, next: boolean) {
    this.templateKeys.push(`stack-${stack}`)
    this.requiredDependencies.push(
      ver('rete', next),
      ver('rete-area-plugin', next),
      ver('rete-connection-plugin', next)
    )
  }
}

export class Angular implements Feature {
  name = 'Angular render'
  templateKeys: DefaultTemplateKey[] = ['angular-render']
  requiredDependencies: string[] = []

  constructor(version: 12 | 13 | 14 | 15 | 16 | null, next: boolean) {
    if (version !== null) this.templateKeys.push(`angular${version}`)

    this.requiredDependencies.push(
      `@angular/elements@${version}`,
      ver('rete-render-utils', next),
      ver('rete-angular-render-plugin', next)
    )
  }
}

export class React implements Feature {
  name = 'React render'
  templateKeys: DefaultTemplateKey[] = ['react-render']
  requiredDependencies = [
    'styled-components@5',
    '@types/styled-components@5'
  ]

  constructor(version: number, stack: AppStack, next: boolean) {
    if (version === 18) this.templateKeys.push('react18')

    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-react-render-plugin', next)
    )
    if (stack !== 'react') {
      this.requiredDependencies.push(
        `react@${version}`,
        `react-dom@${version}`,
        `@types/react-dom@${version}`
      )
    }
  }
}

export class Vue implements Feature {
  name = 'Vue render'
  templateKeys: DefaultTemplateKey[] = ['vue-render']
  requiredDependencies: string[] = ['sass-loader', 'sass']

  constructor(version: 2 | 3, next: boolean) {
    if (version === 2) this.templateKeys.push('vue2')

    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-vue-render-plugin', next)
    )
  }
}

export class Svelte implements Feature {
  name = 'Svelte render'
  templateKeys: DefaultTemplateKey[] = ['svelte-render']
  requiredDependencies: string[] = ['sass']

  constructor(version: 3 | 4, next: boolean) {
    this.templateKeys.push(`svelte${version}`)
    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-svelte-plugin', next)
    )
  }
}

export class OrderNodes implements Feature {
  name = 'Order nodes'
  templateKeys: DefaultTemplateKey[] = ['import-area-extensions', 'order-nodes']
}

export class ZoomAt implements Feature {
  name = 'Zoom at'
  templateKeys: DefaultTemplateKey[] = ['import-area-extensions', 'zoom-at']
}

export class Arrange implements Feature {
  name = 'Auto arrange'
  templateKeys: DefaultTemplateKey[] = ['arrange', 'sizes']
  requiredDependencies = [
    'elkjs',
    'web-worker'
  ]

  constructor(next: boolean) {
    this.requiredDependencies.push(
      ver('rete-auto-arrange-plugin', next)
    )
  }
}

export class Dataflow implements Feature {
  name = 'Dataflow engine'
  templateKeys: DefaultTemplateKey[] = ['dataflow']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(
      ver('rete-engine', next)
    )
  }
}

export class Readonly implements Feature {
  name = 'Readonly'
  templateKeys: DefaultTemplateKey[] = ['readonly']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(
      ver('rete-readonly-plugin', next)
    )
  }
}

export class ContextMenu implements Feature {
  name = 'Context menu'
  templateKeys: DefaultTemplateKey[] = ['context-menu']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(
      ver('rete-context-menu-plugin', next)
    )
  }
}

export class Minimap implements Feature {
  name = 'Minimap'
  templateKeys: DefaultTemplateKey[] = ['minimap', 'sizes']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(
      ver('rete-minimap-plugin', next)
    )
  }
}

export class Reroute implements Feature {
  name = 'Reroute'
  templateKeys: DefaultTemplateKey[] = ['reroute']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(
      ver('rete-connection-reroute-plugin', next)
    )
  }
}

export class Selectable implements Feature {
  name = 'Selectable nodes'
  templateKeys: DefaultTemplateKey[] = ['import-area-extensions', 'selectable']
}

export class Area3D implements Feature {
  name = '3D'
  mandatory = true
  templateKeys: DefaultTemplateKey[] = []
  requiredDependencies: string[] = ['three']

  constructor(typings: boolean, next: boolean) {
    if (typings) this.requiredDependencies.push('@types/three')
    this.requiredDependencies.push(
      ver('rete-area-3d-plugin', next)
    )
  }
}

export function validateFeatures(features: Feature[], options: { stack: AppStack }) {
  if (!features.some(feature => {
    return feature instanceof Angular
      || feature instanceof React
      || feature instanceof Vue
      || feature instanceof Svelte
  })) {
    return {
      issue: 'At least one render plugin should be selected'
    }
  }
  if (options.stack !== 'angular' && features.some(feature => feature instanceof Angular)) {
    return {
      issue: 'Angular render plugin is only allowed in Angular app stack'
    }
  }

  return {
    issue: null
  }
}

export function ensureFeatures(features: Feature[], all: Feature[]) {
  features
  all
  chalk
  // const enabledContextMenu = features.some(feature => feature instanceof ContextMenu)
  // const enabledReact = features.some(feature => feature instanceof React)

  // if (enabledContextMenu && !enabledReact) {
  //   const reactRender = all.find(feature => feature instanceof React)

  //   if (!reactRender) throw new Error('cannot find React feature')

  //   console.log(chalk.yellow('Enabling React render plugin since it is required for Context menu..'))
  //   features.push(reactRender)
  // }
}

export function getDependencies(features: Feature[]) {
  return features.map(feature => feature.requiredDependencies || []).flat()
}
