import deeplib_style from '../styles/index.scss';
import { BaseModule, ModSdkManager, Localization, modules, registerModule, Style, ModStorage, MainMenuOptions, MainMenu, TranslationOptions, Logger } from '../deeplib';

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
 * Mod specific logger instance.
 * Initialized by `initMod()`.
 */
export let modLogger: Logger;

/**
 * Entry point for initializing a mod. Handles:
 *  - Setting up the Mod SDK
 *  - Preparing persistent storage
 *  - Injecting required styles
 *  - Delaying initialization until login (if necessary)
 */
export function initMod(options: InitOptions) {
  const url = 'https://cdn.jsdelivr.net/npm/bondage-club-mod-sdk@1.2.0/+esm';

  import(`${url}`).then(() => {
    sdk = new ModSdkManager(options.modInfo.info, options.modInfo.options);
    const MOD_NAME = ModSdkManager.ModInfo.name;

    modStorage = new ModStorage(ModSdkManager.ModInfo.name);
    modLogger = new Logger(MOD_NAME);
    Style.injectInline('deeplib-style', deeplib_style);

    modLogger.debug('Init wait');
    if (!CurrentScreen || CurrentScreen === 'Login') {
      options.beforeLogin?.();
      const removeHook = sdk.hookFunction('LoginResponse', 0, (args, next) => {
        modLogger.debug('Init! LoginResponse caught: ', args);
        next(args);
        const response = args[0];
        if (response === 'InvalidNamePassword') return next(args);
        if (response && typeof response.Name === 'string' && typeof response.AccountName === 'string') {
          init(options);
          removeHook();
        }
      });
    } else {
      modLogger.debug(`Already logged in, initing ${MOD_NAME}`);
      init(options);
    }
  });
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
 * @param {InitOptions} options Configuration for mod initialization.
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

  await options.initFunction?.();

  if (options.mainMenuOptions)
    MainMenu.setOptions(options.mainMenuOptions);

  (window as any)[MOD_NAME + 'Loaded'] = true;
  modLogger.log(`Loaded! Version: ${MOD_VERSION}`);
}


/**
 * Registers and starts all modules.
 * Runs `init()`, `load()`, and `run()` for each module in order.
 */
function initModules(modulesToRegister: BaseModule[]): boolean {
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

  // Running after `.load` because the version modules runs migrations.
  // If this will run before `.load` some data used in migration might be overwriten.
  for (const module of modules()) {
    module.registerDefaultSettings(modStorage.playerStorage);
  }

  modLogger.debug('Modules Loaded.');
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
  modLogger.debug('Unloaded.');
  return true;
}

/** Calls the `unload()` lifecycle method on all registered modules. */
function unloadModules() {
  for (const module of modules()) {
    module.unload();
  }
}
