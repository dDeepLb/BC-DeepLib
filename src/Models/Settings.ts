import { BaseSettingsModel } from '../DeepLib';

export type SettingsModel = {
  [x: string]: any;
  GlobalModule: BaseSettingsModel;
  Version: string;
};
