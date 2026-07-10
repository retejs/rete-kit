/* eslint-disable @typescript-eslint/naming-convention */
import { input, select } from '../shared/inquirer'
import { throwError } from '../shared/throw'
import { install } from './dependencies-installer'
import * as Features from './features'
import * as Patch from './patch'
import {
  AngularBuilder, LitViteBuilder, NextBuilder, NuxtBuilder,
  ReactBuilder, ReactViteBuilder, SvelteBuilder,
  ViteBuilder, VueBuilder, VueViteBuilder
} from './stack'
import { AngularVersion } from './stack/angular'
import { SvelteVersion } from './stack/svelte'
import { DefaultTemplateKey, TemplateBuilder } from './template-builder'

export const builders = {
  angular: new AngularBuilder(),
  vue: new VueBuilder(),
  'vue-vite': new VueViteBuilder(),
  react: new ReactBuilder(),
  'react-vite': new ReactViteBuilder(),
  svelte: new SvelteBuilder(),
  vite: new ViteBuilder(),
  next: new NextBuilder(),
  nuxt: new NuxtBuilder(),
  'lit-vite': new LitViteBuilder()
}

export type AppStack = keyof typeof builders
export const appStacks = Object.keys(builders) as AppStack[]
export { Features }
export type { FeaturesInput } from './features'

type Options = {
  name?: string
  stack?: AppStack
  version?: number
  features?: Features.FeaturesInput
  depsAlias?: string
  depsLabel?: string
  next?: boolean
  forceInstall?: boolean
}

// eslint-disable-next-line max-statements, complexity
export async function createApp({ name, stack, version, features, depsAlias, forceInstall = false, next = false }: Options) {
  const appName = name || await input('Name')
  const selectedStack = stack || await select('Stack (framework)', appStacks.map(key => ({
    name: builders[key].name,
    value: key
  })))

  if (!appStacks.includes(selectedStack)) throwError('unknown stack')

  const builder = builders[selectedStack]
  const builderVersions = builder.versions as number[]
  const selectedVersion = version || await select<number>('Version', builderVersions.map(value => ({
    name: String(value),
    value: value
  })))

  if (!builderVersions.includes(selectedVersion)) {
    throwError('specified version is not available for selected stack')
  }

  const featuresList: Features.Feature[] = [
    new Features.Default(builder.foundation, next),
    new Features.Area3D(!(builder instanceof AngularBuilder && selectedVersion < 13), next),
    new Features.Angular(builder.foundation === 'angular'
      ? selectedVersion as AngularVersion
      : null, next),
    new Features.React(builder.foundation === 'react'
      ? selectedVersion
      : 18, selectedStack, next),
    new Features.Vue(builder.foundation === 'vue' && !(builder instanceof NuxtBuilder)
      ? selectedVersion as 2 | 3
      : 3, next),
    new Features.Svelte(builder.foundation === 'svelte'
      ? selectedVersion as SvelteVersion
      : 4, next),
    new Features.Lit(builder.foundation === 'lit'
      ? selectedVersion as 3
      : 3, next),
    new Features.OrderNodes(),
    new Features.ZoomAt(),
    new Features.Arrange(next),
    new Features.Dataflow(next),
    new Features.Readonly(next),
    new Features.Selectable(),
    new Features.ContextMenu(next),
    new Features.Minimap(next),
    new Features.Reroute(next),
    new Features.Comments(next),
    new Features.History(next),
    new Features.Scopes(next)
  ]
  const mandatoryFeatures = featuresList.filter(feature => feature.mandatory)
  const optionalFeatures = featuresList.filter(feature => !feature.mandatory)
  const sources = await TemplateBuilder.getTemplates()
  const jobs = Features.resolveJobs(
    sources,
    optionalFeatures,
    selectedStack,
    features
      ? { features }
      : {
        selected: await select('Select features', optionalFeatures.map(feature => ({
          name: feature.name,
          value: feature
        })), true)
      }
  )

  const { exists } = await Patch.ensure(appName, selectedStack, selectedVersion)

  if (!exists) await builder.create(appName, selectedVersion)
  await Patch.commit(appName, selectedStack, selectedVersion)

  const activeFeatures = [...mandatoryFeatures, ...jobs.flatMap(job => job.features)]
  const templateBuilder = new TemplateBuilder<DefaultTemplateKey>(Features.featureKeys(activeFeatures))
  const extras = jobs.filter(job => job.name !== job.from).map(job => job.name)

  await builder.putAssets(appName, selectedVersion, templateBuilder)

  for (const job of jobs) {
    const currentBuilder = new TemplateBuilder<DefaultTemplateKey>(Features.featureKeys([
      ...mandatoryFeatures,
      ...job.features
    ]))

    try {
      const code = await currentBuilder.build(await currentBuilder.load(job.from))

      await builder.putScript(appName, `${job.name}.ts`, code, selectedVersion)
    } catch (e) {
      console.error(e)
      throwError(`failed to build template "${job.name}"`)
    }
  }
  await builder.putScript(appName, `index.ts`, await templateBuilder.getEntryScript(extras), selectedVersion)

  await install(appName, Features.getDependencies(activeFeatures), depsAlias, forceInstall)
}
