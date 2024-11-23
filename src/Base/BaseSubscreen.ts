import { SettingElement } from '../../.types/elements';
import { BaseModule, BaseSettingsModel, SupportHelper, bcSdkMod, dataStore, elementAdjustFontSize, elementAppendToSettingsDiv, elementAppendToSubscreenDiv, elementCreateButton, elementCreateInput, elementCreateLabel, elementCreateSettingsDiv, elementCreateSubscreenDiv, elementGetSettingsDiv, elementGetSubscreenDiv, elementHide, elementRemoveSubscreenDiv, elementSetPosSizeFont, elementSetPosition, elementSetSize, getText, modules, setSubscreen } from '../DeepLib';
import elementCreateCheckbox from '../Utilities/Elements/Checkbox';

export abstract class BaseSubscreen {
  static currentElements: [HTMLElement, SettingElement][] = [];
  static currentPage: number = 1;
  readonly module!: BaseModule;

  constructor(module?: BaseModule) {
    if (module) this.module = module;
  }

  get name(): string {
    return 'UNKNOWN';
  }

  get icon(): string {
    return '';
  }

  get subscreenName(): string {
    return this.constructor.name;
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

  load() {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;
      if (!module.settings || !Object.keys(module.settings).length) module.registerDefaultSettings();
    }

    elementCreateSubscreenDiv();
    const settingsElement = elementCreateSettingsDiv();
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
        tooltip: getText('settings.button.back_button_hint')
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

  run() {
    const newTitle = getText('mainmenu.title').replace('$ModVersion', bcSdkMod.ModInfo.version) + '  ' + SupportHelper.getSupporter();
    const oldTitle = ElementContent('deeplib-subscreen-title');
    if (newTitle !== oldTitle) {
      ElementContent('deeplib-subscreen-title', newTitle);
    }
    DrawCharacter(Player, 50, 50, 0.9, false);

    if (this.pageStructure.length > 1) {
      MainCanvas.textAlign = 'center';
      PreferencePageChangeDraw(1595, 75, this.pageStructure.length);
      MainCanvas.textAlign = 'left';
    }

    this.hideElements();
  }

  click() {
    if (this.pageStructure.length > 1) PreferencePageChangeClick(1595, 75, this.pageStructure.length);
  }

  exit() {
    CharacterAppearanceForceUpCharacter = -1;
    CharacterLoadCanvas(Player);

    setSubscreen('mainmenu');
    dataStore();
  }

  resize(onLoad: boolean = false) {
    elementSetPosSizeFont({ element: elementGetSubscreenDiv() }, 0, 0, 2000, 1000);
    if (this.name === 'mainmenu') {
      elementSetPosSizeFont({ element: elementGetSettingsDiv() }, 530, 170, 800, 735);
    } else {
      elementSetPosSizeFont({ element: elementGetSettingsDiv() }, 530, 170, 1000, 735);
    }

    elementSetPosSizeFont({ elementId: 'deeplib-subscreen-title' }, 530, 75, 800, 90);

    BaseSubscreen.currentElements.forEach((item) => {
      const options = item[1];
      if (options.position)
        elementSetPosition({ elementId: options.id }, options.position[0], options.position[1]);
      if (options.size)
        elementSetSize({ elementId: options.id }, options.size[0], options.size[1]);
      elementAdjustFontSize({ elementId: options.id });
    });
  }

  unload() {
    this.pageStructure.forEach((s) =>
      s.forEach((item) => {
        switch (item.type) {
          case 'text':
            item.setSettingValue(ElementValue(item.id));
            break;
          case 'checkbox': {
            const elem = document.getElementById(item.id) as HTMLInputElement;
            const checked = elem.checked;
            item.setSettingValue(checked);
            break;
          }
        }
      })
    );
    BaseSubscreen.currentElements = [];

    elementRemoveSubscreenDiv();
  }
}

