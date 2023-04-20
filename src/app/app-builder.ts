export interface AppBuilder {
  name: string
  versions: number[]

  create(name: string, version: number): Promise<void>
  putScript(name: string, path: string, code: string): Promise<void>
  getStaticPath(name: string): string
}
