import { BaseSettingsModel } from './Base';

export type SettingsModel = {
  [x: string]: any;
  GlobalModule: BaseSettingsModel;
  Version: string;
};
