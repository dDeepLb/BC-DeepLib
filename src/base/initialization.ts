
import deeplib_style from '../styles/deeplib-style.scss';
import { BaseModule, ModSdkManager, dataTake, deepLibLogger, Localization, modules, registerModule, Style, VersionModule } from '../deeplib';

interface InitOptions {
  modInfo: {
    info: ModSDKModInfo,
    options?: ModSDKModOptions
  };
  initFunction: () => (void | Promise<void>);
  modules: BaseModule[];
  pathToTranslationsFolder?: string;
}

export function initMod(options: InitOptions) {
  const sdk = new ModSdkManager(options.modInfo.info, options.modInfo.options);
  const MOD_NAME = ModSdkManager.ModInfo.name;

  deepLibLogger.debug(`Init wait for ${MOD_NAME}`);
  if (CurrentScreen == null || CurrentScreen === 'Login') {
    sdk.hookFunction('LoginResponse', 0, (args, next) => {
      deepLibLogger.debug(`Init for ${MOD_NAME}! LoginResponse caught: `, args);
      next(args);
      const response = args[0];
      if (response === 'InvalidNamePassword') return next(args);
      if (response && typeof response.Name === 'string' && typeof response.AccountName === 'string') {
        init(options);
      }
    });
  } else {
    deepLibLogger.debug(`Already logged in, initing ${MOD_NAME}`);
    init(options);
  }

  return { sdk };
}

export async function init(options: InitOptions) {
  const MOD_NAME = ModSdkManager.ModInfo.name;
  const MOD_VERSION = ModSdkManager.ModInfo.version;

  if ((window as any)[MOD_NAME + 'Loaded']) return;

  dataTake();

  Style.injectInline('deeplib-style', deeplib_style);

  if (options.pathToTranslationsFolder) {
    new Localization({ pathToTranslationsFolder: options.pathToTranslationsFolder });
    await Localization.init();
  }

  if (!initModules(options.modules)) {
    unloadMod();
    return;
  }

  await options.initFunction();

  VersionModule.checkVersionUpdate();

  (window as any)[MOD_NAME + 'Loaded'] = true;
  deepLibLogger.log(`Loaded ${MOD_NAME}! Version: ${MOD_VERSION}`);
}

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

export function unloadMod(): true {
  const MOD_NAME = ModSdkManager.ModInfo.name;
  unloadModules();

  delete (window as any)[MOD_NAME + 'Loaded'];
  deepLibLogger.debug(`Unloaded ${MOD_NAME}.`);
  return true;
}

function unloadModules() {
  for (const module of modules()) {
    module.unload();
  }
}
