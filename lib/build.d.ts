export declare interface BuildConfig {
  /** Entry file located in `src/` */
  entry?: string,
  /** Output file located in `{distDirName}/` */
  outfile?: string,
  /** Global name of the mod */
  globalName: string,
  /** Directory name of the dist folder, where the mod will be built */
  distDirName?: string,
  /** Directory name of the public folder, where the mod assets will be copied */
  publicDirName?: string,
  /** `node` scripts to run */
  scripts?: string[],
  /** URL to the mod on the production server */
  prodRemoteURL: string,
  /** URL to the mod on the development server */
  devRemoteURL: string,
  /** Target version of the build */
  target?: string[],
  /** Additional esbuild plugins */
  plugins?: import('esbuild').Plugin[],
  /** Additional esbuild defines (like global variables) */
  defines?: {
    [key: string]: unknown
  },
  /** Host of the local dev server */
  host?: string,
  /** Port of the local dev server */
  port?: number
} 

export declare function defineConfig(config: BuildConfig): BuildConfig;