import { AppStack } from '.'
import { DefaultTemplateKey } from './template-builder'

function ver(name: string, next: boolean) {
  return `${name}@${next ? 'next': 2}`
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
  requiredDependencies: string[] = []

  constructor(next: boolean) {
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

  constructor(version: 12 | 13 | 14 | 15 | null, next: boolean) {
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
    'styled-components'
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
        `react-dom@${version}`
      )
    }
  }
}

export class Vue implements Feature {
  name = 'Vue render'
  templateKeys: DefaultTemplateKey[] = ['vue-render']
  requiredDependencies: string[] = []

  constructor(version: 2 | 3, next: boolean) {
    if (version === 2) this.templateKeys.push('vue2')

    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-vue-render-plugin', next)
    )
  }
}

export class OrderNodes implements Feature {
  name = 'Order nodes'
  templateKeys: DefaultTemplateKey[] = ['order-nodes']
}

export class ZoomAt implements Feature {
  name = 'Zoom at'
  templateKeys: DefaultTemplateKey[] = ['zoom-at']
}

export class Arrange implements Feature {
  name = 'Auto arrange'
  templateKeys: DefaultTemplateKey[] = ['arrange']
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

export class Selectable implements Feature {
  name = 'Selectable nodes'
  templateKeys: DefaultTemplateKey[] = ['selectable']
}

export function validateFeatures(features: Feature[], options: { stack: AppStack }) {
  if (!features.some(feature => feature instanceof Angular || feature instanceof React || feature instanceof Vue)) {
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

export function getDependencies(features: Feature[]) {
  return features.map(feature => feature.requiredDependencies || []).flat()
}
