import type { TSConfig } from '../../../shared/ts-config'

export type AngularVersion = 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21

export interface AngularTSConfig extends TSConfig {
  angularCompilerOptions: {
    disableTypeScriptVersionCheck?: boolean
  }
}
