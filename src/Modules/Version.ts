import { BaseMigrator, BaseModule, HookPriority, PlayerStorage, bcSdkMod, dataStore, deepLibLogger, sendLocalMessage } from '../DeepLib';

export class VersionModule extends BaseModule {
  private static isItNewVersion: boolean = false;
  static Version: string;
  static NewVersionMessage: string = '';
  private static Migrators: BaseMigrator[] = [];

  load(): void {
    VersionModule.Version = bcSdkMod.ModInfo.version;

    bcSdkMod.prototype.hookFunction(
      'ChatRoomSync',
      HookPriority.Observe,
      (args, next) => {
        next(args);
        // if (PlayerStorage().GlobalModule.doShowNewVersionMessage && VersionModule.isItNewVersion) {
        // }
        VersionModule.sendNewVersionMessage();
      },
      999
    );
  }

  static checkVersionUpdate() {
    const PreviousVersion = VersionModule.loadVersion();
    const CurrentVersion = VersionModule.Version;

    if (VersionModule.isNewVersion(PreviousVersion, CurrentVersion)) {
      VersionModule.isItNewVersion = true;
      VersionModule.saveVersion();
    }
  }

  static checkVersionMigration() {
    const PreviousVersion = VersionModule.loadVersion();

    let saveRequired = false;
    for (const migrator of VersionModule.Migrators) {
      if (this.isNewVersion(PreviousVersion, migrator.MigrationVersion)) {
        saveRequired = saveRequired || migrator.Migrate();
        deepLibLogger.info(`Migrating ${bcSdkMod.ModInfo.name} from ${PreviousVersion} to ${migrator.MigrationVersion} with ${migrator.constructor.name}`);
      }
    }

    if (saveRequired) {
      dataStore();
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
      Player[bcSdkMod.ModInfo.name].Version = VersionModule.Version;
    }
  }

  private static loadVersion() {
    return PlayerStorage()?.Version;
  }
}
