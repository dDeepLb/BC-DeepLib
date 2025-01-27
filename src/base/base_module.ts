import { BaseSettingsModel, PlayerStorage, SettingsModel, Subscreen, bcSdkMod } from '../deep_lib';

export abstract class BaseModule {
  get settingsScreen(): Subscreen | null {
    return null;
  }

  get settingsStorage(): string | null {
    return this.constructor.name;
  }

  get settings(): BaseSettingsModel {
    const modName = bcSdkMod.ModInfo.name;
    if (!this.settingsStorage) return {} as BaseSettingsModel;
    if (!PlayerStorage()) {
      Player[modName] = <SettingsModel>{};
      this.registerDefaultSettings();
    } else if (!PlayerStorage()[this.settingsStorage]) this.registerDefaultSettings();
    return PlayerStorage()[this.settingsStorage];
  }

  set settings(value) {
    const modName = bcSdkMod.ModInfo.name;
    if (!this.settingsStorage) return;
    if (!PlayerStorage()) {
      Player[modName] = <SettingsModel>{};
      this.registerDefaultSettings();
    } else if (!PlayerStorage()[this.settingsStorage]) this.registerDefaultSettings();
    PlayerStorage()[this.settingsStorage] = value;
  }

  init() {
    this.registerDefaultSettings();
  }

  registerDefaultSettings(): void {
    const storage = this.settingsStorage;
    const defaults = this.defaultSettings;
    if (!storage || !defaults) return;

    Player[bcSdkMod.ModInfo.name][storage] = Object.assign(defaults, Player[bcSdkMod.ModInfo.name][storage] ?? {});
  }

  get defaultSettings(): BaseSettingsModel | null {
    return null;
  }

  load() { }

  run() { }

  unload() { }
}
