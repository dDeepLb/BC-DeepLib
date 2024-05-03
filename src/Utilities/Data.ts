import { bcSdkMod } from './SDK.js';
import { _String } from './String.js';
import { SettingsModel } from '../Models/Settings.js';
import { modules } from '../Base/Modules.js';
import { deepLibLogger } from './Logger.js';

export const PlayerStorage = (): Readonly<SettingsModel> => (typeof Player?.[bcSdkMod.ModInfo.name] === 'object' ? CommonCloneDeep(Player?.[bcSdkMod.ModInfo.name]) : undefined);
export const ExtensionStorage = (): Readonly<string> => Player.ExtensionSettings[bcSdkMod.ModInfo.name];

export function dataTake() {
  const modName = bcSdkMod.ModInfo.name;

  if (ExtensionStorage()) {
    const parsed = JSON.parse(LZString.decompressFromBase64(ExtensionStorage()) || '');
    Player[modName] = Object.hasOwn(Player?.[bcSdkMod.ModInfo.name], "Version") ? parsed : undefined;
  } else {
    Player[modName] = {};
  }
}

export function dataStore() {
  // const modName = bcSdkMod.ModInfo.name;
  // const modVersion = bcSdkMod.ModInfo.version;

  // if (!ExtensionStorage()) Player.ExtensionSettings[modName] = '';
  // const Data: SettingsModel = {
  //   GlobalModule: {
  //     modEnabled: false,
  //     doShowNewVersionMessage: false
  //   },
  //   Version: modVersion
  // };

  // for (let module of modules()) {
  //   if (!module.settingsStorage) continue;

  //   Data[module.settingsStorage] = PlayerStorage()[module.settingsStorage];
  // };

  // Player.ExtensionSettings[modName] = _String.encode(Data);
  // ServerPlayerExtensionSettingsSync(modName);
}
