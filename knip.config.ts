import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: ['kysely.config.ts', 'migrations/**'],
  ignoreDependencies: [/@svgr\/webpack/],
  ignoreExportsUsedInFile: true
}

export default config
