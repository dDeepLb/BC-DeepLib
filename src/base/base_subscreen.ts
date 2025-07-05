import { BaseModule, BaseSettingsModel, GUI, advancedElement, ModSdkManager, domUtil, getText, layoutElement, modules, modStorage } from '../deeplib';
import { SettingElement } from './elements_typings';

type SubscreenOptions = {
  drawCharacter?: boolean;
};

export type Subscreen = new (subscreenOptions?: SubscreenOptions, module?: BaseModule) => BaseSubscreen;

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

export abstract class BaseSubscreen {
  static currentElements: [HTMLElement, SettingElement][] = [];
  static currentPage: number = 1;
  readonly options: SubscreenOptions;
  readonly module!: BaseModule;

  constructor(subscreenOptions?: SubscreenOptions, module?: BaseModule) {
    if (module) this.module = module;
    this.options = subscreenOptions || {} as SubscreenOptions;
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

  set settings(value) {
    this.module.settings = value;
  }

  get pageStructure(): SettingElement[][] {
    return [[]];
  }

  get currentPage(): SettingElement[] {
    return this.pageStructure[Math.min(BaseSubscreen.currentPage - 1, this.pageStructure.length - 1)];
  }

  changePage(page: number, setLabel: (label: string) => void) {
    const totalPages = this.pageStructure.length;

    if (page > totalPages) page = 1;
    if (page < 1) page = totalPages;
    BaseSubscreen.currentPage = page;

    this.managePageElementsVisibility();

    setLabel(`${BaseSubscreen.currentPage} of ${this.pageStructure.length}`);
  }

  managePageElementsVisibility() {
    this.pageStructure.forEach((item, ix) => {
      if (ix != BaseSubscreen.currentPage - 1) {
        item.forEach((setting) => {
          domUtil.hide(`${setting.id}-container`);
        });
      } else {
        item.forEach((setting) => {
          domUtil.unhide(`${setting.id}-container`);
        });
      }
    });
  }

  load() {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;
      if (!module.settings || !Object.keys(module.settings).length) module.registerDefaultSettings();
    }

    BaseSubscreen.currentPage = 1;

    layoutElement.createSubscreenDiv();
    const settingsElement = layoutElement.createSettingsDiv();
    layoutElement.appendToSubscreenDiv(settingsElement);

    const menu = ElementMenu.Create('deeplib-nav-menu', []);
    layoutElement.appendToSubscreenDiv(menu);

    if (this.pageStructure.length > 1) {
      const backNext = advancedElement.createBackNext({
        id: 'deeplib-page-back-next',
        next: ({ setLabel }) => this.changePage(BaseSubscreen.currentPage + 1, setLabel),
        initialNextTooltip: getText('settings.button.next_button_hint'),
        back: ({ setLabel }) => this.changePage(BaseSubscreen.currentPage - 1, setLabel),
        initialPrevTooltip: getText('settings.button.prev_button_hint'),
        initialLabel: `${BaseSubscreen.currentPage} of ${this.pageStructure.length}`,
      });

      ElementMenu.PrependItem(menu, backNext);
    }

    const subscreenTitle = advancedElement.createLabel({
      type: 'label',
      id: 'deeplib-subscreen-title',
      label: getText(`${this.name}.title`).replace('$ModVersion', ModSdkManager.ModInfo.version),
    });
    layoutElement.appendToSubscreenDiv(subscreenTitle);

    if (this.name !== 'mainmenu') {
      const exitButton = advancedElement.createButton({
        type: 'button',
        id: 'deeplib-exit',
        size: [90, 90],
        image: 'Icons/Exit.png',
        onClick: () => {
          this.exit();
        },
        tooltip: getText('settings.button.back_button_hint')
      });
      ElementMenu.AppendButton(menu, exitButton);
    }

    const tooltip = advancedElement.createTooltip();
    layoutElement.appendToSubscreenDiv(tooltip);

    this.pageStructure.forEach((s) =>
      s.forEach((item) => {
        let element: HTMLElement;
        switch (item.type) {
          case 'text':
          case 'number':
          case 'color':
            element = advancedElement.createInput(item);
            break;
          case 'checkbox':
            element = advancedElement.createCheckbox(item);
            break;
          case 'button':
            element = advancedElement.createButton(item);
            break;
          case 'label':
            element = advancedElement.createLabel(item);
            break;
          case 'custom':
            element = advancedElement.createCustom(item);
            break;
        }
        layoutElement.appendToSettingsDiv(element);
      })
    );

    this.managePageElementsVisibility();

    CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
  }

  run() {
    if (this.options.drawCharacter) DrawCharacter(Player, 50, 50, 0.9, false);
  }

  click() {
  }

  exit() {
    CharacterAppearanceForceUpCharacter = -1;
    CharacterLoadCanvas(Player);

    setSubscreen('mainmenu');
    modStorage.save();
  }

  resize(onLoad: boolean = false) {
    const offset = this.options.drawCharacter ? 0 : 380;
    const subscreen = layoutElement.getSubscreenDiv();
    const settingsDiv = layoutElement.getSettingsDiv();

    ElementSetPosition(subscreen || '', 0, 0);
    ElementSetSize(subscreen || '', 2000, 1000);
    ElementSetFontSize(subscreen || '', 'auto');

    if (this.name === 'mainmenu') {
      ElementSetPosition(settingsDiv || '', 530 - offset, 170);
      ElementSetSize(settingsDiv || '', 800 + offset, 660);
    } else {
      ElementSetPosition(settingsDiv || '', 530 - offset, 170);
      ElementSetSize(settingsDiv || '', 1000 + offset, 660);
    }

    ElementSetPosition('deeplib-subscreen-title', 530 - offset, 75);
    ElementSetSize('deeplib-subscreen-title', 800, 60);

    ElementSetPosition('deeplib-nav-menu', 1905, 75, 'top-right');
    ElementSetSize('deeplib-nav-menu', null, 90);

    ElementSetPosition(advancedElement.getTooltip() || '', 250, 850);
    ElementSetSize(advancedElement.getTooltip() || '', 1500, 70);

    BaseSubscreen.currentElements.forEach((item) => {
      const options = item[1];

      domUtil.autoSetPosition(options.id, options.position);
      domUtil.autoSetSize(options.id, options.size);
    });

    if (settingsDiv) {
      if (domUtil.hasOverflow(settingsDiv)?.vertical) {
        settingsDiv.classList.add('deeplib-overflow-box');
      } else {
        settingsDiv.classList.remove('deeplib-overflow-box');
      }
    }
  }

  unload() {
    BaseSubscreen.currentElements = [];

    layoutElement.removeSubscreenDiv();
  }
}

