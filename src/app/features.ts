import { throwError } from '../shared/throw'
import { AppStack } from '.'
import { AngularVersion } from './stack/angular'
import { SvelteVersion } from './stack/svelte'
import { DefaultTemplateKey } from './template-builder'

function ver(name: string, next: boolean) {
  return `${name}@${next
    ? 'next'
    : 2}`
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

  constructor(version: AngularVersion | null, next: boolean) {
    if (version !== null) this.templateKeys.push(`angular${version}`)

    this.requiredDependencies.push(
      `@angular/elements@${version}`,
      ver('rete-render-utils', next),
      ver('rete-angular-plugin', next)
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
    this.templateKeys.push(`react${version}`)

    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-react-plugin', next)
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
    this.templateKeys.push(`vue${version}`)

    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-vue-plugin', next)
    )
  }
}

export class Svelte implements Feature {
  name = 'Svelte render'
  templateKeys: DefaultTemplateKey[] = ['svelte-render']
  requiredDependencies: string[] = ['sass']

  constructor(version: SvelteVersion, next: boolean) {
    this.templateKeys.push(`svelte${version}`)
    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('rete-svelte-plugin', next)
    )
  }
}

export class Lit implements Feature {
  name = 'Lit render'
  templateKeys: DefaultTemplateKey[] = ['lit-render']
  requiredDependencies: string[] = []

  constructor(version: 3, next: boolean) {
    this.templateKeys.push(`lit${version}`)
    this.requiredDependencies.push(
      ver('rete-render-utils', next),
      ver('@retejs/lit-plugin', next)
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
    this.requiredDependencies.push(ver('rete-auto-arrange-plugin', next))
  }
}

export class Dataflow implements Feature {
  name = 'Dataflow engine'
  templateKeys: DefaultTemplateKey[] = ['dataflow']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-engine', next))
  }
}

export class Readonly implements Feature {
  name = 'Readonly'
  templateKeys: DefaultTemplateKey[] = ['readonly']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-readonly-plugin', next))
  }
}

export class ContextMenu implements Feature {
  name = 'Context menu'
  templateKeys: DefaultTemplateKey[] = ['context-menu']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-context-menu-plugin', next))
  }
}

export class Minimap implements Feature {
  name = 'Minimap'
  templateKeys: DefaultTemplateKey[] = ['minimap', 'sizes']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-minimap-plugin', next))
  }
}

export class Reroute implements Feature {
  name = 'Reroute'
  templateKeys: DefaultTemplateKey[] = ['reroute']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-connection-reroute-plugin', next))
  }
}

export class Selectable implements Feature {
  name = 'Selectable nodes'
  templateKeys: DefaultTemplateKey[] = ['import-area-extensions', 'selectable']
}

export class History implements Feature {
  name = 'History'
  templateKeys: DefaultTemplateKey[] = ['history']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-history-plugin', next))
  }
}

export class Comments implements Feature {
  name = 'Comments'
  templateKeys: DefaultTemplateKey[] = ['comments', 'sizes']
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-comment-plugin', next))
  }
}

export class Area3D implements Feature {
  name = '3D'
  mandatory = true
  templateKeys: DefaultTemplateKey[] = []
  requiredDependencies: string[] = []

  constructor(typings: boolean, next: boolean) {
    const version = '0.156'

    if (typings) this.requiredDependencies.push(`@types/three@${version}`)
    this.requiredDependencies.push(
      ver('rete-area-3d-plugin', next),
      `three@${version}`
    )
  }
}

export class Scopes implements Feature {
  name = 'Scopes'
  mandatory = true
  templateKeys: DefaultTemplateKey[] = []
  requiredDependencies: string[] = []

  constructor(next: boolean) {
    this.requiredDependencies.push(ver('rete-scopes-plugin', next))
  }
}

export function validateFeatures(features: Feature[], options: { stack: AppStack }) {
  if (!features.some(feature => {
    return feature instanceof Angular
      || feature instanceof React
      || feature instanceof Vue
      || feature instanceof Svelte
      || feature instanceof Lit
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

export function findFeature(name: string, pool: Feature[]) {
  return pool.find(f => f.name.toLocaleLowerCase() === name.toLocaleLowerCase())
}

export function resolveFeatures(names: string[], pool: Feature[]) {
  return names.map(name => {
    const feature = findFeature(name, pool)

    if (!feature) throwError(`feature ${name} not found`)

    return feature
  })
}

export function featureKeys(features: Feature[]) {
  return features.map(({ templateKeys }) => templateKeys ?? []).flat()
}

export function getDependencies(features: Feature[]) {
  const unique = features.filter((feature, index, list) => {
    return list.findIndex(item => item.name === feature.name) === index
  })

  return unique.map(feature => feature.requiredDependencies ?? []).flat()
}

/** `string[]` — shared features. Object — one base `string[]` + optional extras `{ from, features }`. */
export type FeaturesInput = string[] | Record<string, string[] | { from: string, features: string[] }>

export type TemplateJob = {
  name: string
  from: string
  features: Feature[]
}

function parseFeaturesObject(
  features: Exclude<FeaturesInput, string[]>,
  sources: string[]
) {
  let base: string[] | null = null
  const extras: { name: string, from: string, features: string[] }[] = []

  for (const [name, value] of Object.entries(features)) {
    if (Array.isArray(value)) {
      if (base) throwError('features object can contain only one base features array')
      base = value
    } else {
      if (sources.includes(name)) throwError(`template "${name}" already exists`)
      if (!sources.includes(value.from)) throwError(`template "${name}" from unknown "${value.from}"`)
      extras.push({ name, from: value.from, features: value.features })
    }
  }

  if (!base) throwError('features object must contain a base features array')

  return { base, extras }
}

function resolveValidated(
  names: string[],
  optionalFeatures: Feature[],
  stack: AppStack,
  label?: string
) {
  const resolved = resolveFeatures(names, optionalFeatures)
  const { issue } = validateFeatures(resolved, { stack })

  if (issue) {
    throwError(label
      ? `template "${label}": ${issue}`
      : issue)
  }

  return resolved
}

/** Build template jobs with resolved features. */
export function resolveJobs(
  sources: string[],
  optionalFeatures: Feature[],
  stack: AppStack,
  input: { features: FeaturesInput } | { selected: Feature[] }
): TemplateJob[] {
  if ('selected' in input) {
    const { issue } = validateFeatures(input.selected, { stack })

    if (issue) throwError(issue)

    return sources.map(name => ({ name, from: name, features: input.selected }))
  }

  const { features } = input

  if (Array.isArray(features)) {
    const resolved = resolveValidated(features, optionalFeatures, stack)

    return sources.map(name => ({ name, from: name, features: resolved }))
  }

  const { base, extras } = parseFeaturesObject(features, sources)
  const shared = resolveValidated(base, optionalFeatures, stack)

  return [
    ...sources.map(name => ({ name, from: name, features: shared })),
    ...extras.map(extra => ({
      name: extra.name,
      from: extra.from,
      features: resolveValidated(extra.features, optionalFeatures, stack, extra.name)
    }))
  ]
}
