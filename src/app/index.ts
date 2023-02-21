/* eslint-disable @typescript-eslint/naming-convention */
import { input, select } from '../shared/inquirer'
import { throwError } from '../shared/throw'
import { AngularBuilder } from './angular'
import { install } from './dependencies-installer'
import * as Features from './features'
import { ReactBuilder } from './react'
import { DefaultTemplateKey, TemplateBuilder } from './template-builder'
import { VueBuilder } from './vue'

const builders = {
  angular: new AngularBuilder(),
  vue:  new VueBuilder(),
  react: new ReactBuilder()
}

export type AppStack = keyof typeof builders
export const appStacks = Object.keys(builders) as AppStack[]

// eslint-disable-next-line max-statements
export default async function (name?: string, stack?: AppStack) {
  const appName = name || await input('Name')
  const selectedStack = stack || await select('Stack (framework)', appStacks.map(key => ({
    name: builders[key].name,
    value: key
  })))
  const builder = builders[selectedStack]
  const version = await select('Version', builder.versions.map(value => ({
    name: String(value),
    value: value
  })))
  const template = new TemplateBuilder()

  const features: Features.Feature[] = [
    new Features.Default(),
    new Features.Angular(),
    new Features.React(builder instanceof ReactBuilder ? version : 18),
    new Features.Vue(builder instanceof VueBuilder ? version as 2 : 3),
    new Features.OrderNodes(),
    new Features.ZoomAt(),
    new Features.Arrange(),
    new Features.Dataflow(),
    new Features.Readonly(),
    new Features.Selectable()
  ]
  const mandatoryFeatures = features.filter(feature => feature.mandatory)
  const optionalFeatures = features.filter(feature => !feature.mandatory)
  const selectedFeatures = await select('Select features', optionalFeatures.map(feature => ({
    name: feature.name,
    value: feature
  })), true)
  const activeFeatures = [...mandatoryFeatures, ...selectedFeatures]

  const { issue } = Features.validateFeatures(selectedFeatures)

  if (issue) throwError(issue)

  const defaultTemplate = await template.loadDefault()
  const code = await template.build<DefaultTemplateKey>(defaultTemplate, key => {
    return selectedFeatures.some(feature => feature.templateKeys && feature.templateKeys.includes(key))
  })

  await builder.create(appName, version)
  await builder.putScript(appName, code)
  await install(appName, Features.getDependencies(activeFeatures))
}
