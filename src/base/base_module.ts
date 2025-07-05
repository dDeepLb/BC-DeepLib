import { BaseSettingsModel, SettingsModel, Subscreen, ModSdkManager, ModStorage, modStorage } from '../deeplib';

export abstract class BaseModule {
  get settingsScreen(): Subscreen | null {
    return null;
  }

  get settingsStorage(): string | null {
    return this.constructor.name;
  }

  get settings(): BaseSettingsModel {
    const modName = ModSdkManager.ModInfo.name;
    if (!this.settingsStorage) return {} as BaseSettingsModel;
    if (!modStorage.playerStorage) {
      Player[modName] = <SettingsModel>{};
      this.registerDefaultSettings();
    } else if (!modStorage.playerStorage[this.settingsStorage]) this.registerDefaultSettings();
    return modStorage.playerStorage[this.settingsStorage];
  }

  set settings(value) {
    const modName = ModSdkManager.ModInfo.name;
    const storage = new ModStorage<SettingsModel>(modName);
    if (!this.settingsStorage) return;
    if (!storage.playerStorage) {
      Player[modName] = <SettingsModel>{};
      this.registerDefaultSettings();
    } else if (!storage.playerStorage[this.settingsStorage]) this.registerDefaultSettings();
    storage.playerStorage[this.settingsStorage] = value;
  }

  init() {
    this.registerDefaultSettings();
  }

  registerDefaultSettings(): void {
    const storage = this.settingsStorage;
    const defaults = this.defaultSettings;
    if (!storage || !defaults) return;

    Player[ModSdkManager.ModInfo.name][storage] = Object.assign(defaults, Player[ModSdkManager.ModInfo.name][storage] ?? {});
  }

  get defaultSettings(): BaseSettingsModel | null {
    return null;
  }

  load() { }

  run() { }

  unload() { }
}
