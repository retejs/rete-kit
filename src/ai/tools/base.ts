export interface Tool {
  getName(): string
  getAssetPath(): string
  getTargetFilePath(): string
}

export abstract class BaseTool implements Tool {
  constructor(protected name: string, protected assetPath: string) {}

  getName(): string {
    return this.name
  }

  getAssetPath(): string {
    return this.assetPath
  }

  abstract getTargetFilePath(): string
}
