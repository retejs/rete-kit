/* eslint-disable @typescript-eslint/naming-convention */
import { input, select } from '../shared/inquirer'
import { throwError } from '../shared/throw'
import { install } from './dependencies-installer'
import * as Features from './features'
import * as Patch from './patch'
import { AngularBuilder, ReactBuilder, VueBuilder, VueViteBuilder } from './stack'
import { DefaultTemplateKey, TemplateBuilder } from './template-builder'

export const builders = {
  'angular': new AngularBuilder(),
  'vue':  new VueBuilder(),
  'vue-vite':  new VueViteBuilder(),
  'react': new ReactBuilder()
}

export type AppStack = keyof typeof builders
export const appStacks = Object.keys(builders) as AppStack[]
export { Features }

type Options = {
  name?: string
  stack?: AppStack
  version?: number
  features?: string[]
  depsAlias?: string
  depsLabel?: string
  next?: boolean
}

// eslint-disable-next-line max-statements, complexity
export async function createApp({ name, stack, version, features, depsAlias, next = false }: Options) {
  const appName = name || await input('Name')
  const selectedStack = stack || await select('Stack (framework)', appStacks.map(key => ({
    name: builders[key].name,
    value: key
  })))

  if (!appStacks.includes(selectedStack)) throwError('unknown stack')

  const builder = builders[selectedStack]
  const selectedVersion = version || await select('Version', builder.versions.map(value => ({
    name: String(value),
    value: value
  })))

  if (!builder.versions.includes(selectedVersion)) throwError('specified version is not available for selected stack')

  const templateBuilder = new TemplateBuilder()

  const featuresList: Features.Feature[] = [
    new Features.Default(next),
    new Features.Angular(builder instanceof AngularBuilder ? selectedVersion as 12 | 13 | 14 | 15 : null, next),
    new Features.React(builder instanceof ReactBuilder ? selectedVersion : 18, selectedStack, next),
    new Features.Vue(builder instanceof VueBuilder ? selectedVersion as 2 : 3, next),
    new Features.OrderNodes(),
    new Features.ZoomAt(),
    new Features.Arrange(next),
    new Features.Dataflow(next),
    new Features.Readonly(next),
    new Features.Selectable(),
    new Features.ContextMenu(next)
  ]
  const mandatoryFeatures = featuresList.filter(feature => feature.mandatory)
  const optionalFeatures = featuresList.filter(feature => !feature.mandatory)
  const selectedFeatures = features?.length
    ? features.map(featureName => {
      const feature = optionalFeatures.find(f => f.name.toLocaleLowerCase() === featureName.toLocaleLowerCase())

      if (!feature) throw throwError(`feature ${featureName} not found`)

      return feature
    })
    : await select('Select features', optionalFeatures.map(feature => ({
      name: feature.name,
      value: feature
    })), true)

  const { issue } = Features.validateFeatures(selectedFeatures, { stack: selectedStack })

  if (issue) throwError(issue)

  Features.ensureFeatures(selectedFeatures, featuresList)

  const activeFeatures = [...mandatoryFeatures, ...selectedFeatures]
  const template = await templateBuilder.loadDefault()
  const code = await templateBuilder.build<DefaultTemplateKey>(template, key => {
    return selectedFeatures.some(feature => feature.templateKeys && feature.templateKeys.includes(key))
  })

  const { exists } = await Patch.ensure(appName, selectedStack, selectedVersion)

  if (!exists) await builder.create(appName, selectedVersion)
  await Patch.commit(appName, selectedStack, selectedVersion)
  await builder.putScript(appName, code)
  await install(appName, Features.getDependencies(activeFeatures), depsAlias)
}
