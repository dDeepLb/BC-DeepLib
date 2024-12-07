import { BaseSettingsModel } from '../deep_lib';

export type SettingsModel = {
  [x: string]: any;
  GlobalModule: BaseSettingsModel;
  Version: string;
};
