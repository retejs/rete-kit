import { TemplateBuilder } from './template-builder'

export interface AppBuilder {
  name: string // stack name, e.g. framework + build tool
  versions: number[]
  foundation: string // library or framework name

  create(name: string, version: number): Promise<void>
  putAssets<Key extends string>(name: string, version: number, templateBuilder: TemplateBuilder<Key>): Promise<void>
  putScript(name: string, path: string, code: string): Promise<void>
  getStaticPath(name: string, version?: number): string
  getBuildCommand(version: number): string
}
