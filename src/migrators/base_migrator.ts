/**
 * Abstract base class for versioned migration handlers.
 *
 * A migrator is responsible for upgrading or transforming stored data
 * when the mod version changes. Each migrator targets a specific version
 * and executes its {@link migrate} method once when needed.
 *
 * @remarks
 * To create a new migrator:
 * 1. Extend `BaseMigrator`.
 * 2. Implement the {@link migrationVersion} getter to return the target version string.
 * 3. Implement {@link migrate} with the migration logic (e.g., data structure changes).
 */
export abstract class BaseMigrator {

  /**
   * Gets the target version string for this migration.
   *
   * @remarks
   * - This should exactly match the version format used by the mod
   * - Used by the migration system to determine if this migration should be executed.
   */
  abstract get migrationVersion(): string;

  /**
   * Executes the migration logic for this version.
   *
   * @remarks
   * - Called once when upgrading from a version earlier than {@link migrationVersion}.
   * - Should handle any necessary data transformations, cleanup, or initialization
   *   to bring the mod's state up to date with the new version.
   * - Must be idempotent — running it multiple times should not cause data corruption.
   */
  abstract migrate(): void;
}
