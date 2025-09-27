import deeplib_style from '../styles/index.scss';
import { BaseModule, ModSdkManager, deepLibLogger, Localization, modules, registerModule, Style, VersionModule, hasSetter, deepMergeMatchingProperties, hasGetter, BaseMigrator, ModStorage, MainMenuOptions, MainMenu, TranslationOptions } from '../deeplib';

/** Configuration object for initializing a mod via `initMod`. */
interface InitOptions {
  /**
   * Information about the mod being initialized.
   * - `info`    — Required metadata describing the mod.
   * - `options` — Optional runtime configuration for the Mod SDK.
   */
  modInfo: {
    info: ModSDKModInfo,
    options?: ModSDKModOptions
  };

  /**
   * List of modules (`BaseModule` subclasses) to register with the mod system.
   * Modules are initialized, loaded, and run in order.
   */
  modules?: BaseModule[];

  /**
   * List of data migration handlers to register with the `VersionModule`.
   * Each `BaseMigrator` handles upgrading data from one version to another.
   */
  migrators?: BaseMigrator[];

  /** Configuration for customizing the main menu when the mod is active. */
  mainMenuOptions?: MainMenuOptions;

  /**
   * Optional hook executed *before* login when the player is not yet authenticated.
   * Useful for pre-login setup or display changes.
   */
  beforeLogin?: () => (void);

  /**
   * Optional async/sync function run after modules and translations are initialized.
   * Can be used to perform additional setup tasks.
   */
  initFunction?: () => (void | Promise<void>);

  /** Options for initializing the localization/translation system. */
  translationOptions?: TranslationOptions;
}

/**
 * Global storage handler for mod.
 * Initialized by `initMod()` and mod data loaded by `init()`.
 */
export let modStorage: ModStorage;

/**
 * Global Mod SDK manager.
 * Initialized by `initMod()`.
 */
export let sdk: ModSdkManager;

/**
 * Entry point for initializing a mod. Handles:
 *  - Setting up the Mod SDK
 *  - Preparing persistent storage
 *  - Injecting required styles
 *  - Delaying initialization until login (if necessary)
 */
export function initMod(options: InitOptions) {
  sdk = new ModSdkManager(options.modInfo.info, options.modInfo.options);
  const MOD_NAME = ModSdkManager.ModInfo.name;

  modStorage = new ModStorage(ModSdkManager.ModInfo.name);
  Style.injectInline('deeplib-style', deeplib_style);

  deepLibLogger.debug(`Init wait for ${MOD_NAME}`);
  if (CurrentScreen == null || CurrentScreen === 'Login') {
    options.beforeLogin?.();
    const removeHook = sdk.hookFunction('LoginResponse', 0, (args, next) => {
      deepLibLogger.debug(`Init for ${MOD_NAME}! LoginResponse caught: `, args);
      next(args);
      const response = args[0];
      if (response === 'InvalidNamePassword') return next(args);
      if (response && typeof response.Name === 'string' && typeof response.AccountName === 'string') {
        init(options);
        removeHook();
      }
    });
  } else {
    deepLibLogger.debug(`Already logged in, initing ${MOD_NAME}`);
    init(options);
  }
}


/**
 * Fully initializes the mod after login.
 * Handles:
 *  - Preventing double-load
 *  - Loading mod data
 *  - Initializing localization
 *  - Registering modules and migrators
 *  - Running optional init functions
 *  - Applying main menu changes
 *  - Merging default settings into module settings
 *
 * @param options {InitOptions} Configuration for mod initialization.
 */
async function init(options: InitOptions) {
  const MOD_NAME = ModSdkManager.ModInfo.name;
  const MOD_VERSION = ModSdkManager.ModInfo.version;

  if ((window as any)[MOD_NAME + 'Loaded']) return;

  modStorage.load();

  await Localization.init(options.translationOptions);

  if (options.modules && !initModules(options.modules)) {
    unloadMod();
    return;
  }

  if (options.migrators) {
    for (const m of options.migrators) {
      VersionModule.registerMigrator(m);
    }
  }

  await options.initFunction?.();

  if (options.mainMenuOptions)
    MainMenu.setOptions(options.mainMenuOptions);

  for (const m of modules()) {
    if (m.defaultSettings && hasGetter(m, 'defaultSettings') && m.settings && hasSetter(m, 'settings')) {
      if (Object.entries(m.defaultSettings).length === 0) continue;
      m.settings = deepMergeMatchingProperties(m.defaultSettings, m.settings);
    }
  }

  (window as any)[MOD_NAME + 'Loaded'] = true;
  deepLibLogger.log(`Loaded ${MOD_NAME}! Version: ${MOD_VERSION}`);
}


/**
 * Registers and starts all modules.
 * Runs `init()`, `load()`, and `run()` for each module in order.
 */
function initModules(modulesToRegister: BaseModule[]): boolean {
  const MOD_NAME = ModSdkManager.ModInfo.name;

  for (const module of modulesToRegister) {
    registerModule(module);
  }

  for (const module of modules()) {
    module.init();
  }

  for (const module of modules()) {
    module.load();
  }

  for (const module of modules()) {
    module.run();
  }

  deepLibLogger.debug(`Modules Loaded for ${MOD_NAME}.`);
  return true;
}

/** 
 * Cleans up and removes the mod from memory.
 * Calls `unload()` on all modules and removes the global loaded flag.
 */
export function unloadMod(): true {
  const MOD_NAME = ModSdkManager.ModInfo.name;
  unloadModules();

  delete (window as any)[MOD_NAME + 'Loaded'];
  deepLibLogger.debug(`Unloaded ${MOD_NAME}.`);
  return true;
}

/** Calls the `unload()` lifecycle method on all registered modules. */
function unloadModules() {
  for (const module of modules()) {
    module.unload();
  }
}
