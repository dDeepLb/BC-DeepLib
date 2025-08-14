/**
 * Base public URL used for loading assets (e.g., images, translation files).
 * 
 * This value is set at build time and configured via `deeplib.config.js`.
 */
declare const PUBLIC_URL: string;

/**
 * The current mod version.
 * 
 * This value is set at build time and configured via `version` field in the `package.json` file.
 * @example
 * ```json
 * {
 *  "name": "example-mod",
 *  "version": "1.0.0",
 *  "author": "your-name",
 * }
 *  ```
 */
declare const MOD_VERSION: string;

/**
 * The unique hash of the current commit.
 * 
 * The hash is computed automatically from the current commit.
 * 
 * Used for build identification.
 * @example "a1b2c3d4"
 */
declare const VERSION_HASH: string;

/**
 * Whether the build is a development build.
 * 
 * `true` for development/local builds, `false` for production.
 */
declare const IS_DEVEL: boolean;

/**
 * Whether debugging features are enabled.
 * 
 * `true` when mod is built with `--debug`/`-d`.
 */
declare const IS_DEBUG: boolean;