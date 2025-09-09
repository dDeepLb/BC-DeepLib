import { BaseMigrator, BaseModule, ModSdkManager, deepLibLogger, getText, modStorage } from '../deeplib';

export type VersionModuleOptions = {
  newVersionMessage: string;
  beforeEach?: () => void;
  afterEach?: () => void;
  beforeAll?: () => void;
  afterAll?: () => void;
};

/**
 * Handles version tracking, new version detection, and version-based migrations
 * for the mod. Also manages displaying a "new version" message to players and
 * executing registered migration routines when an update occurs.
 * 
 * **Key Responsibilities:**
 * - Track and store the current mod version in persistent player storage.
 * - Detect if the mod has been updated since the last session.
 * - Run version-specific migrations via registered `BaseMigrator` instances.
 * - Optionally display a message to the user upon detecting a new version.
 */
export class VersionModule extends BaseModule {
  /** Whether the current session is running a new version compared to stored data */
  private static isItNewVersion: boolean = false;

  /** The current mod version (retrieved from `ModSdkManager.ModInfo.version`) */
  private static version: string;

  /** Message to display when a new version is detected */
  private static newVersionMessage: string = '';

  /** List of registered migration handlers, sorted by version */
  private static migrators: BaseMigrator[] = [];

  /** Optional lifecycle hook. Runs before each migration */
  private static beforeEach?: () => void;
  /** Optional lifecycle hook. Runs after each migration */
  private static afterEach?: () => void;
  /** Optional lifecycle hook. Runs before all migrations */
  private static beforeAll?: () => void;
  /** Optional lifecycle hook. Runs after all migrations */
  private static afterAll?: () => void;

  constructor(options: VersionModuleOptions) {
    super();

    VersionModule.newVersionMessage = options.newVersionMessage;

    VersionModule.beforeEach = options.beforeEach;
    VersionModule.afterEach = options.afterEach;
    VersionModule.beforeAll = options.beforeAll;
    VersionModule.afterAll = options.afterAll;
  }

  /**
   * Initializes the module on load:
   * - Stores the current mod version.
   * - Hooks into `ChatRoomSync` to show a "new version" message when applicable.
   */
  load(): void {
    VersionModule.version = ModSdkManager.ModInfo.version;

    VersionModule.checkVersionUpdate();

    if (modStorage.playerStorage.GlobalModule.doShowNewVersionMessage && VersionModule.isItNewVersion) {
      VersionModule.sendNewVersionMessage();
    }
  }

  /**
   * Checks if the stored version differs from the current version.
   * If a new version is detected:
   * - Flags the session as updated.
   * - Runs applicable migrations.
   * - Updates stored version in player data.
   * - Saves `modStorage`.
   */
  private static checkVersionUpdate() {
    const previousVersion = VersionModule.loadVersion();
    const currentVersion = VersionModule.version;

    if (VersionModule.isNewVersion(previousVersion, currentVersion)) {
      VersionModule.isItNewVersion = true;
      VersionModule.checkVersionMigration();
      VersionModule.saveVersion();
    }

    modStorage.save();
  }

  /**
   * Executes migrations for all registered migrators whose `MigrationVersion`
   * is newer than the previously stored version.
   */
  private static checkVersionMigration() {
    const previousVersion = VersionModule.loadVersion();
    const toMigrate = VersionModule.migrators.filter(m =>
      VersionModule.isNewVersion(previousVersion, m.MigrationVersion)
    );

    if (!toMigrate.length) return;

    VersionModule.beforeAll?.();

    for (const migrator of toMigrate) {
      VersionModule.beforeEach?.();

      migrator.Migrate();
      deepLibLogger.info(
        `Migrating ${ModSdkManager.ModInfo.name} from ${previousVersion} to ${migrator.MigrationVersion} with ${migrator.constructor.name}`
      );

      VersionModule.afterEach?.();
    }

    VersionModule.afterAll?.();
  }

  /**
   * Registers a new migrator for handling version-specific changes.
   * Migrators are sorted by their `MigrationVersion` in ascending order.
   */
  static registerMigrator(migrator: BaseMigrator) {
    VersionModule.migrators.push(migrator);

    VersionModule.migrators.sort((a, b) => a.MigrationVersion.localeCompare(b.MigrationVersion));
  }

  /** Sends the currently configured "new version" message to the local player. */
  static sendNewVersionMessage() {
    const beepLogLength = FriendListBeepLog.push({
      MemberNumber: Player.MemberNumber,
      MemberName: ModSdkManager.ModInfo.name,
      ChatRoomName: getText('module.version.version_update'),
      ChatRoomSpace: 'X',
      Private: false,
      Sent: false,
      Time: new Date(),
      Message: VersionModule.newVersionMessage
    });

    const beepIdx = beepLogLength - 1;
    const title = CommonStringPartitionReplace(getText('module.version.new_version_toast_title'), {
      $modName$: ModSdkManager.ModInfo.name,
      $modVersion$: VersionModule.version
    }).join('');
    const data = FriendListBeepLog[beepIdx];

    ServerShowBeep(VersionModule.newVersionMessage, 10000, {
      memberNumber: data.MemberNumber,
      memberName: data.MemberName,
      chatRoomName: data.ChatRoomName,
      ...(data.Message && {
        onClick: () => {
          FriendListShowBeep(beepIdx);
        }
      })
    }, title);
  }

  /**
   * Determines if a given `candidate` version is newer than the `current` version.
   * 
   * Version strings are expected in `MAJOR.MINOR.PATCH` format.
   */
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

  /** Saves the current mod version into persistent player storage. */
  private static saveVersion() {
    if (modStorage.playerStorage) {
      Player[ModSdkManager.ModInfo.name].Version = VersionModule.version;
    }
  }

  /** Loads the stored mod version from persistent player storage. */
  private static loadVersion() {
    return modStorage.playerStorage?.Version;
  }
}
