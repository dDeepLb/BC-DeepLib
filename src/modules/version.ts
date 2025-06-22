import { BaseMigrator, BaseModule, HookPriority, PlayerStorage, ModSdkManager, dataStore, deepLibLogger, sendLocalMessage } from '../deep_lib';

export class VersionModule extends BaseModule {
  private static isItNewVersion: boolean = false;
  static Version: string;
  static NewVersionMessage: string = '';
  private static Migrators: BaseMigrator[] = [];

  load(): void {
    VersionModule.Version = ModSdkManager.ModInfo.version;

    ModSdkManager.prototype.hookFunction(
      'ChatRoomSync',
      HookPriority.Observe,
      (args, next) => {
        next(args);
        if (PlayerStorage().GlobalModule.doShowNewVersionMessage && VersionModule.isItNewVersion) {
          VersionModule.sendNewVersionMessage();
        }
      },
      999
    );
  }

  static checkVersionUpdate() {
    const PreviousVersion = VersionModule.loadVersion();
    const CurrentVersion = VersionModule.Version;

    if (VersionModule.isNewVersion(PreviousVersion, CurrentVersion)) {
      VersionModule.isItNewVersion = true;
      VersionModule.checkVersionMigration();
      VersionModule.saveVersion();
    }

    dataStore();
  }

  private static checkVersionMigration() {
    const PreviousVersion = VersionModule.loadVersion();

    let saveRequired = false;
    for (const migrator of VersionModule.Migrators) {
      if (VersionModule.isNewVersion(PreviousVersion, migrator.MigrationVersion)) {
        saveRequired = saveRequired || migrator.Migrate();
        deepLibLogger.info(`Migrating ${ModSdkManager.ModInfo.name} from ${PreviousVersion} to ${migrator.MigrationVersion} with ${migrator.constructor.name}`);
      }
    }
  }
  
  static registerMigrator(migrator: BaseMigrator) {
    VersionModule.Migrators.push(migrator);
  }

  static setNewVersionMessage(newVersionMessage: string) {
    VersionModule.NewVersionMessage = newVersionMessage;
  }

  static sendNewVersionMessage() {
    sendLocalMessage('deeplib-new-version', VersionModule.NewVersionMessage);
  }

  private static isNewVersion(current: string | undefined, candidate: string) {
    if (current !== undefined) {
      const CURRENT_ = current.split('.'),
        CANDIDATE_ = candidate.split('.');
      for (let i = 0; i < 3; i++) {
        if (CURRENT_[i] === CANDIDATE_[i]) {
          continue;
        }
        return CANDIDATE_[i] > CURRENT_[i];
      }
    }
    if (current === undefined || current === '' || !current) {
      return true;
    }
    return false;
  }

  private static saveVersion() {
    if (PlayerStorage()) {
      Player[ModSdkManager.ModInfo.name].Version = VersionModule.Version;
    }
  }

  private static loadVersion() {
    return PlayerStorage()?.Version;
  }
}
