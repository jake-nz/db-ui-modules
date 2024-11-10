import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  //   entry: ['src/index.ts'],
  //   project: ['src/**/*.ts']
  ignore: ['kysely.config.ts', 'migrations/**']
}

export default config
