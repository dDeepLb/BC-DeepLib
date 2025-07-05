import { SettingsModel, deepLibLogger } from '../deeplib';

export class ModStorage<T extends SettingsModel = SettingsModel> {
  private static _instance: ModStorage | null = null;
  private modName: string;

  constructor(modName: string) {
    if (!ModStorage._instance) {
      ModStorage._instance = this;
    this.modName = modName;
    }
    this.modName ??= modName

    return ModStorage._instance as ModStorage<T>;
  }

  get playerStorage(): T {
    return Player[this.modName];
  }

  set playerStorage(value: T) {
    Player[this.modName] = value;
  }

  get extensionStorage(): string {
    return Player.ExtensionSettings[this.modName];
  }

  set extensionStorage(value: string) {
    Player.ExtensionSettings[this.modName] = value;
  }

  setLocalStorage(key: string, value: object) {
    localStorage.setItem(`${this.modName}_${key}`, ModStorage.dataCompress(value));
  }

  getLocalStorage(key: string): object | null {
    const data = localStorage.getItem(`${this.modName}_${key}`);

    if (!data) return null;

    return ModStorage.dataDecompress<T>(data);
  }

  load() {
    if (this.extensionStorage) {
      const parsed = ModStorage.dataDecompress<T>(this.extensionStorage || '');
      if (parsed === null || !Object.hasOwn(parsed, 'Version')) {
        this.playerStorage = {} as T;
      } else {
        this.playerStorage = parsed;
      };
    } else {
      this.playerStorage = {} as T;
    }
  }

  save() {
    if (!this.extensionStorage) this.extensionStorage = '';
    this.extensionStorage = ModStorage.dataCompress(this.playerStorage);
    ServerPlayerExtensionSettingsSync(this.modName);
  }

  static dataDecompress<T = object>(string: string): T | null {
    const d = LZString.decompressFromBase64(string as string);
    let data: T | null = null;

    try {
      const decoded: T = JSON.parse(d as string);
      data = decoded;
    } catch (error) {
      deepLibLogger.error(error);
    }

    return data;
  }

  static dataCompress(object: object) {
    return LZString.compressToBase64(JSON.stringify(object));
  }
}
