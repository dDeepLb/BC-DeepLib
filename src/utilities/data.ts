import { SettingsModel, ModSdkManager, deepLibLogger, modules } from '../deeplib';

export const PlayerStorage = (): SettingsModel => (Player[ModSdkManager.ModInfo.name]);
export const ExtensionStorage = (): Readonly<string> => Player.ExtensionSettings[ModSdkManager.ModInfo.name];

export function dataTake(modName: string = ModSdkManager.ModInfo.name) {
  if (ExtensionStorage()) {
    const parsed = dataDecompress(ExtensionStorage() || '');
    Player[modName] = Object.hasOwn(parsed, 'Version') ? parsed : undefined;
  } else {
    Player[modName] = {};
  }
}

export function dataStore() {
  const modName = ModSdkManager.ModInfo.name;
  const modVersion = ModSdkManager.ModInfo.version;

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
