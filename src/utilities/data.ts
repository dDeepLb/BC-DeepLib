import { SettingsModel, bcSdkMod, deepLibLogger, modules } from '../deep_lib';

export const PlayerStorage = (): SettingsModel => (Player[bcSdkMod.ModInfo.name]);
export const ExtensionStorage = (): Readonly<string> => Player.ExtensionSettings[bcSdkMod.ModInfo.name];

export function dataTake(modName: string = bcSdkMod.ModInfo.name) {
  if (ExtensionStorage()) {
    const parsed = dataDecompress(ExtensionStorage() || '');
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
  }

  Player.ExtensionSettings[modName] = dataCompress(Data);
  ServerPlayerExtensionSettingsSync(modName);
}

function dataCompress(string: object) {
  return LZString.compressToBase64(JSON.stringify(string));
}

function dataDecompress(string: string) {
  const d = LZString.decompressFromBase64(string as string);
  let data = {};

  try {
    const decoded = JSON.parse(d as string);
    data = decoded;
  } catch (error) {
    deepLibLogger.error(error);
    data = {};
  }

  return data;
}
