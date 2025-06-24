import { BaseSettingsModel } from '../deeplib';

export type SettingsModel = {
  [x: string]: any;
  GlobalModule: BaseSettingsModel;
  Version: string;
};
