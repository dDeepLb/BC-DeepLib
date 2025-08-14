/** 
 * Represents the base settings structure for a mod.
 * Present for all mods.
 */
export type BaseSettingsModel = {
  /** Whether the mod is currently active. */
  modEnabled: boolean;
  
  /** Whether to display a notification when a new version is detected. */
  doShowNewVersionMessage: boolean;
};
