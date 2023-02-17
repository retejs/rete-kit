export interface AppBuilder {
  name: string
  versions: number[]

  create(name: string, version: number): Promise<void>
}
