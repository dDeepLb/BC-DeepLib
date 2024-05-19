import { SettingElement } from '../../.types/elements';
import { BaseModule, BaseSettingsModel, SupportHelper, bcSdkMod, dataStore, elementAdjustFontSize, elementAppendToSettingsDiv, elementAppendToSubscreenDiv, elementCreateButton, elementCreateCheckbox, elementCreateInput, elementCreateLabel, elementCreateSettingsDiv, elementCreateSubscreenDiv, elementGetSettingsDiv, elementGetSubscreenDiv, elementHide, elementRemoveSubscreenDiv, elementSetPosSizeFont, elementSetPosition, elementSetSize, getText, modules, setSubscreen } from '../DeepLib';

export const SETTING_FUNC_PREFIX: string = 'PreferenceSubscreen';
export let SETTING_NAME_PREFIX: string = 'DeepLib';
export const SETTING_FUNC_NAMES: string[] = ['Load', 'Run', 'Click', 'Unload', 'Exit'];

export abstract class BaseSubscreen {
  static currentElements: [HTMLElement, SettingElement][] = [];
  static currentPage: number = 1;
  readonly module!: BaseModule;

  constructor(module?: BaseModule) {
    if (module) this.module = module;
    SETTING_NAME_PREFIX = bcSdkMod.ModInfo.name;

    SETTING_FUNC_NAMES.forEach((name) => {
      const fName = SETTING_FUNC_PREFIX + SETTING_NAME_PREFIX + this.name + name;
      if (typeof (<any>this)[name] === 'function' && typeof (<any>window)[fName] !== 'function')
        (<any>window)[fName] = () => {
          (<any>this)[name]();
        };
    });
  }

  get name(): string {
    return 'UNKNOWN';
  }

  get icon(): string {
    return '';
  }

  get subscreenName(): string {
    return SETTING_NAME_PREFIX + this.constructor.name;
  }

  setSubscreen(screen: BaseSubscreen | string | null) {
    return setSubscreen(screen);
  }

  get settings(): BaseSettingsModel {
    return this.module.settings as BaseSettingsModel;
  }

  get pageStructure(): SettingElement[][] {
    return [[]];
  }

  get currentPage(): SettingElement[] {
    return this.pageStructure[Math.min(PreferencePageCurrent - 1, this.pageStructure.length - 1)];
  }

  hideElements() {
    this.pageStructure.forEach((item, ix) => {
      if (ix != PreferencePageCurrent - 1) {
        item.forEach((setting) => {
          elementHide({ elementId: setting.id });
        });
      }
    });
  }

  Load() {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;
      if (!module.settings || !Object.keys(module.settings).length) module.registerDefaultSettings();
    }

    const subscreenElement = elementCreateSubscreenDiv();
    const settingsElement = elementCreateSettingsDiv();
    settingsElement.style.backgroundColor = 'lime';
    elementAppendToSubscreenDiv(settingsElement);

    const subscreenTitle = elementCreateLabel({
      type: 'label',
      id: 'deeplib-subscreen-title',
      label: getText('mainmenu.title').replace('$ModVersion', bcSdkMod.ModInfo.version) + '  ' + SupportHelper.getSupporter(),
    });
    elementAppendToSubscreenDiv(subscreenTitle);
    elementSetPosSizeFont({ element: subscreenTitle }, 530, 75, 800, 90);

    if (this.name !== 'mainmenu') {
      const exitButton = elementCreateButton({
        type: 'button',
        id: 'deeplib-exit',
        position: [1815, 75],
        size: [90, 90],
        image: 'Icons/Exit.png',
        onClick: () => {
          setSubscreen('mainmenu');
        },
        hoverHint: getText('settings.button.back_button_hint')
      });
      elementAppendToSubscreenDiv(exitButton);
    }

    this.pageStructure.forEach((s) =>
      s.forEach((item) => {
        let element: HTMLElement;
        switch (item.type) {
          case 'text':
          case 'number':
            element = elementCreateInput(item);
            break;
          case 'checkbox':
            element = elementCreateCheckbox(item);
            break;
          case 'button':
            element = elementCreateButton(item);
            break;
          case 'label':
            element = elementCreateLabel(item);
            break;
        }
        elementAppendToSettingsDiv(element);

        if (item.position)
          elementSetPosition({ elementId: item.id }, item.position[0], item.position[1]);
        if (item.size)
          elementSetSize({ elementId: item.id }, item.size[0], item.size[1]);
      })
    );

    CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
  }

  Run() {
    ElementContent('deeplib-subscreen-title', getText('mainmenu.title').replace('$ModVersion', bcSdkMod.ModInfo.version) + '  ' + SupportHelper.getSupporter());
    DrawCharacter(Player, 50, 50, 0.9, false);

    if (this.pageStructure.length > 1) {
      MainCanvas.textAlign = 'center';
      PreferencePageChangeDraw(1595, 75, this.pageStructure.length);
      MainCanvas.textAlign = 'left';
    }

    this.hideElements();
  }

  Click() {
    if (this.pageStructure.length > 1) PreferencePageChangeClick(1595, 75, this.pageStructure.length);
  }

  Exit() {
    this.pageStructure.forEach((s) =>
      s.forEach((item) => {
        switch (item.type) {
          case 'number':
            if (!CommonIsNumeric(ElementValue(item.id))) {
              ElementRemove(item.id);
            }
            break;
          case 'text':
            item.setSettingValue(ElementValue(item.id));
            ElementRemove(item.id);
            break;
        }
      })
    );

    CharacterAppearanceForceUpCharacter = -1;
    CharacterLoadCanvas(Player);

    setSubscreen('mainmenu');
    dataStore();
  }

  OnScreenChange() {
    elementRemoveSubscreenDiv();
  }

  OnResize() {
    elementSetPosSizeFont({ element: elementGetSubscreenDiv() }, 0, 0, 2000, 1000);
    elementSetPosSizeFont({ element: elementGetSettingsDiv() }, 530, 170, 800, 735);

    elementSetPosSizeFont({ elementId: 'deeplib-subscreen-title' }, 530, 75, 800, 90);

    BaseSubscreen.currentElements.forEach((item) => {
      const element = item[0];
      const options = item[1];
      if (options.position)
        elementSetPosition({ elementId: options.id }, options.position[0], options.position[1]);
      if (options.size)
        elementSetSize({ elementId: options.id }, options.size[0], options.size[1]);
      elementAdjustFontSize({ elementId: options.id });
    });
  }

  Unload() { }
}

