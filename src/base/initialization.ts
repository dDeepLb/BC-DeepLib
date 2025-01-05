import deeplib_style from '../../public/styles/DeepLib.css';
import gratitude_style from '../../public/styles/Gratitude.css';
import { BaseModule, bcSdkMod, dataTake, deepLibLogger, Localization, modules, registerModule, Style, VersionModule } from '../deep_lib';

export function initMod(initFunction: (() => void) | (() => Promise<void>), modules: BaseModule[], pathToTranslationsFolder: string) {
  const MOD_NAME = bcSdkMod.ModInfo.name;
  deepLibLogger.debug(`Init wait for ${MOD_NAME}`);
  if (CurrentScreen == null || CurrentScreen === 'Login') {
    bcSdkMod.prototype.hookFunction('LoginResponse', 0, (args, next) => {
      deepLibLogger.debug(`Init for ${MOD_NAME}! LoginResponse caught: `, args);
      next(args);
      const response = args[0];
      if (response === 'InvalidNamePassword') return next(args);
      if (response && typeof response.Name === 'string' && typeof response.AccountName === 'string') {
        init(initFunction, modules, pathToTranslationsFolder);
      }
    });
  } else {
    deepLibLogger.debug(`Already logged in, initing ${MOD_NAME}`);
    init(initFunction, modules, pathToTranslationsFolder);
  }
}

export async function init(initFunction: (() => void) | (() => Promise<void>), modules: BaseModule[], pathToTranslationsFolder: string) {
  const MOD_NAME = bcSdkMod.ModInfo.name;
  const MOD_VERSION = bcSdkMod.ModInfo.version;

  if ((window as any)[MOD_NAME + 'Loaded']) return;

  dataTake();

  Style.inject('gratitude-style', gratitude_style);
  Style.inject('deeplib-style', deeplib_style);

  new Localization({ pathToTranslationsFolder: pathToTranslationsFolder });
  await Localization.init();

  if (!initModules(modules)) {
    unloadMod();
    return;
  }

  await initFunction();

  VersionModule.checkVersionUpdate();

  (window as any)[MOD_NAME + 'Loaded'] = true;
  deepLibLogger.log(`Loaded ${MOD_NAME}! Version: ${MOD_VERSION}`);
}

function initModules(modulesToRegister: BaseModule[]): boolean {
  const MOD_NAME = bcSdkMod.ModInfo.name;

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
  const MOD_NAME = bcSdkMod.ModInfo.name;
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
