import { BaseModule, BaseSettingsModel, GUI, advancedElement, ModSdkManager, dataStore, domUtil, getText, layoutElement, modules } from '../deep_lib';
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

  changePage(page: number) {
    const totalPages = this.pageStructure.length;

    if (page > totalPages) page = 1;
    if (page < 1) page = totalPages;
    BaseSubscreen.currentPage = page;

    this.managePageElementsVisibility();

    const pageLabel = ElementWrap('deeplib-page-label');
    if (pageLabel) pageLabel.innerHTML = `${BaseSubscreen.currentPage} of ${this.pageStructure.length}`;
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

    if (this.pageStructure.length > 1) {
      const prev = advancedElement.createButton({
        type: 'button',
        id: 'deeplib-prev-page',
        position: [1495, 75],
        size: [90, 90],
        image: 'Icons/Prev.png',
        onClick: () => {
          this.changePage(BaseSubscreen.currentPage - 1);
        },
        tooltip: getText('settings.button.prev_button_hint')
      });
      layoutElement.appendToSubscreenDiv(prev);

      const pageLabel = advancedElement.createLabel({
        type: 'label',
        id: 'deeplib-page-label',
        position: [1585, 75],
        size: [110, 90],
        label: `${BaseSubscreen.currentPage} of ${this.pageStructure.length}`,

      });
      layoutElement.appendToSubscreenDiv(pageLabel);

      const next = advancedElement.createButton({
        type: 'button',
        id: 'deeplib-next-page',
        position: [1695, 75],
        size: [90, 90],
        image: 'Icons/Next.png',
        onClick: () => {
          this.changePage(BaseSubscreen.currentPage + 1);
        },
        tooltip: getText('settings.button.next_button_hint')
      });
      layoutElement.appendToSubscreenDiv(next);
    }

    const subscreenTitle = advancedElement.createLabel({
      type: 'label',
      id: 'deeplib-subscreen-title',
      label: getText('mainmenu.title').replace('$ModVersion', ModSdkManager.ModInfo.version),
    });
    layoutElement.appendToSubscreenDiv(subscreenTitle);

    if (this.name !== 'mainmenu') {
      const exitButton = advancedElement.createButton({
        type: 'button',
        id: 'deeplib-exit',
        position: [1815, 75],
        size: [90, 90],
        image: 'Icons/Exit.png',
        onClick: () => {
          this.exit();
        },
        tooltip: getText('settings.button.back_button_hint')
      });
      layoutElement.appendToSubscreenDiv(exitButton);
    }

    const tooltip = advancedElement.createTooltip();
    layoutElement.appendToSubscreenDiv(tooltip);

    this.pageStructure.forEach((s) =>
      s.forEach((item) => {
        let element: HTMLElement;
        switch (item.type) {
          case 'text':
          case 'number':
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
    dataStore();
  }

  resize(onLoad: boolean = false) {
    const offset = this.options.drawCharacter ? 0 : 380;

    ElementSetPosition(layoutElement.getSubscreenDiv() || '', 0, 0);
    ElementSetSize(layoutElement.getSubscreenDiv() || '', 2000, 1000);
    ElementSetFontSize(layoutElement.getSubscreenDiv() || '', 'auto');

    if (this.name === 'mainmenu') {
      ElementSetPosition(layoutElement.getSettingsDiv() || '', 530 - offset, 170);
      ElementSetSize(layoutElement.getSettingsDiv() || '', 800 + offset, 660);
    } else {
      ElementSetPosition(layoutElement.getSettingsDiv() || '', 530 - offset, 170);
      ElementSetSize(layoutElement.getSettingsDiv() || '', 1000 + offset, 660);
    }

    ElementSetPosition('deeplib-subscreen-title', 530 - offset, 75);
    ElementSetSize('deeplib-subscreen-title', 800, 60);

    ElementSetPosition(advancedElement.getTooltip() || '', 250, 850);
    ElementSetSize(advancedElement.getTooltip() || '', 1500, 70);

    BaseSubscreen.currentElements.forEach((item) => {
      const options = item[1];

      domUtil.autoSetPosition(options.id, options.position);
      domUtil.autoSetSize(options.id, options.size);
    });
  }

  unload() {
    this.pageStructure.forEach((s) =>
      s.forEach((item) => {
        switch (item.type) {
          case 'text':
            item?.setSettingValue?.(ElementValue(item.id));
            break;
          case 'checkbox': {
            const elem = document.getElementById(item.id) as HTMLInputElement;
            const checked = elem.checked;
            item?.setSettingValue?.(checked);
            break;
          }
        }
      })
    );
    BaseSubscreen.currentElements = [];

    layoutElement.removeSubscreenDiv();
  }
}

