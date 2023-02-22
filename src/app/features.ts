import { DefaultTemplateKey } from './template-builder'

export interface Feature {
  name: string
  mandatory?: boolean
  templateKeys?: DefaultTemplateKey[]
  requiredDependencies?: string[]
}

export class Default implements Feature {
  name = 'Default'
  mandatory = true
  requiredDependencies = [
    'rete',
    'rete-area-plugin',
    'rete-connection-plugin'
  ]
}

export class Angular implements Feature {
  name = 'Angular render'
  templateKeys: DefaultTemplateKey[] = ['angular-render']
  requiredDependencies = [
    '@angular/elements',
    'rete-render-utils',
    'rete-angular-render-plugin'
  ]
}

export class React implements Feature {
  name = 'React render'
  templateKeys: DefaultTemplateKey[] = ['react-render']
  requiredDependencies = [
    'rete-render-utils',
    'rete-react-render-plugin',
    'styled-components'
  ]

  constructor(version: number) {
    if (version === 18) this.templateKeys.push('react18')
  }
}

export class Vue implements Feature {
  name = 'Vue render'
  templateKeys: DefaultTemplateKey[] = ['vue-render']
  requiredDependencies = [
    'rete-render-utils',
    'rete-vue-render-plugin'
  ]

  constructor(version: 2 | 3) {
    if (version === 2) this.templateKeys.push('vue2')
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
    'web-worker',
    'rete-auto-arrange-plugin'
  ]
}

export class Dataflow implements Feature {
  name = 'Dataflow engine'
  templateKeys: DefaultTemplateKey[] = ['dataflow']
  requiredDependencies = [
    'rete-engine'
  ]
}

export class Readonly implements Feature {
  name = 'Readonly'
  templateKeys: DefaultTemplateKey[] = ['readonly']
  requiredDependencies = [
    'rete-readonly-plugin'
  ]
}

export class Selectable implements Feature {
  name = 'Selectable nodes'
  templateKeys: DefaultTemplateKey[] = ['selectable']
}

export function validateFeatures(features: Feature[]) {
  if (!features.some(feature => feature instanceof Angular || feature instanceof React || feature instanceof Vue)) {
    return {
      issue: 'At least one render plugin should be selected'
    }
  }

  return {
    issue: null
  }
}

export function getDependencies(features: Feature[]) {
  return features.map(feature => feature.requiredDependencies || []).flat()
}
