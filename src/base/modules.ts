import { BaseModule } from '../deeplib';

/**
 * Global registry of all loaded modules, keyed by their class name.
 *
 * The map is populated via {@link registerModule} and accessed via {@link modules} or {@link getModule}.
 * This is the central storage for active `BaseModule` instances during the mod lifecycle.
 */
export const modulesMap: Map<string, BaseModule> = new Map<string, BaseModule>();

/**
 * Retrieves all registered module instances.
 *
 * @returns An array containing every module currently stored in {@link modulesMap}.
 *
 * @remarks
 * The returned array is a **shallow copy** of the `Map` values, meaning that
 * changes to the array do not affect the registry itself.
 *
 * @example
 * ```ts
 * for (const mod of modules()) {
 *   mod.run();
 * }
 * ```
 */
export function modules(): BaseModule[] {
  return [...modulesMap.values()];
}


/**
 * Registers a module instance in the global registry.
 * 
 * @returns The same module instance passed in, for chaining or immediate use.
 *
 * @remarks
 * - If a module with the same constructor name already exists, it will be **overwritten**.
 * - Keys are based on the class name (`module.constructor.name`), so name collisions are possible
 *   if two different classes share the same name.
 *
 * @example
 * ```ts
 * registerModule(new MyGlobalModule());
 * ```
 */
export function registerModule<T extends BaseModule>(module: T): T {
  modulesMap.set(module.constructor.name, module);
  return module;
}


/**
 * Retrieves a registered module by its type name.
 *
 * @returns The matching module instance cast to type `T`, or `undefined` if not found.
 *
 * @remarks
 * This function does not perform runtime type checks. If the type parameter `T`
 * does not match the actual module type, you may get runtime errors when using the result.
 *
 * @example
 * ```ts
 * const themeModule = getModule<ThemeModule>('ThemeModule');
 * themeModule?.reloadTheme();
 * ```
 */
export function getModule<T extends BaseModule>(moduleType: string): T {
  return modulesMap.get(moduleType) as T;
}
