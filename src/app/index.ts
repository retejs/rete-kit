import { input, select } from '../shared/inquirer'
import { AngularBuilder } from './angular'
import { ReactBuilder } from './react'
import { VueBuilder } from './vue'

const builders = {
  angular: new AngularBuilder(),
  vue:  new VueBuilder(),
  react: new ReactBuilder()
}

export type AppStack = keyof typeof builders
export const appStacks = Object.keys(builders) as AppStack[]

export default async function (name?: string, stack?: AppStack) {
  const appName = name || await input('Name')
  const selectedStack = stack || await select('Stack (framework)', appStacks.map(key => ({
    name: builders[key].name,
    value: key
  })))
  const selectedBuilder = builders[selectedStack]
  const version = await select('Version', selectedBuilder.versions.map(value => ({
    name: String(value),
    value: value
  })))

  await selectedBuilder.create(appName, version)
}
