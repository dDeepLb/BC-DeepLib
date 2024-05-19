import { SettingsModel, _String, bcSdkMod, modules } from '../DeepLib';

export const PlayerStorage = (): Readonly<SettingsModel> => (
  typeof Player?.[bcSdkMod.ModInfo.name] === 'object' ?
    CommonCloneDeep(Player?.[bcSdkMod.ModInfo.name]) :
    undefined
);
export const ExtensionStorage = (): Readonly<string> => Player.ExtensionSettings[bcSdkMod.ModInfo.name];

export function dataTake(modName: string = bcSdkMod.ModInfo.name) {
  if (ExtensionStorage()) {
    const parsed = JSON.parse(LZString.decompressFromBase64(ExtensionStorage()) || '');
    Player[modName] = Object.hasOwn(parsed, 'Version') ? parsed : undefined;
  } else {
    Player[modName] = {};
  }
}

export function dataStore() {
  const modName = bcSdkMod.ModInfo.name;
  const modVersion = bcSdkMod.ModInfo.version;

  if (!ExtensionStorage()) Player.ExtensionSettings[modName] = '';
  const Data: SettingsModel = {
    GlobalModule: {
      modEnabled: false,
      doShowNewVersionMessage: false
    },
    Version: modVersion
  };

  for (const module of modules()) {
    if (!module.settingsStorage) continue;

    Data[module.settingsStorage] = PlayerStorage()[module.settingsStorage];
  };

  Player.ExtensionSettings[modName] = _String.encode(Data);
  ServerPlayerExtensionSettingsSync(modName);
}
