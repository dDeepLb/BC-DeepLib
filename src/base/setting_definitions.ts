import { BaseSubscreen, GUI } from '../deep_lib';

export function getCurrentSubscreen(): BaseSubscreen | null {
  return GUI.instance && GUI.instance.currentSubscreen;
}

export function setSubscreen(subscreen: BaseSubscreen | string | null): BaseSubscreen | null {
  if (!GUI.instance) {
    throw new Error('Attempt to set subscreen before init');
  }
  GUI.instance.currentSubscreen = subscreen;

  return GUI.instance.currentSubscreen;
}
