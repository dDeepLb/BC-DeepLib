import { BaseModule, BaseSettingsModel, GUI, SupportHelper, bcSdkMod, dataStore, elementAppendToSettingsDiv, elementAppendToSubscreenDiv, elementCreateButton, elementCreateCheckbox, elementCreateInput, elementCreateLabel, elementCreateSettingsDiv, elementCreateSubscreenDiv, elementCreateTooltip, elementGet, elementGetSettingsDiv, elementGetSubscreenDiv, elementGetTooltip, elementHide, elementRemoveSubscreenDiv, elementSetPosSizeFont, elementSetPosition, elementSetSize, elementUnhide, getText, modules } from '../deep_lib';
import { SettingElement } from './elements_typings';

type SubscreenOptions = {
  drawCharacter?: boolean
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

    const pageLabel = elementGet({ elementId: 'deeplib-page-label' }, 'changePage');
    if (pageLabel) pageLabel.innerHTML = `${BaseSubscreen.currentPage} of ${this.pageStructure.length}`;
  }

  managePageElementsVisibility() {
    this.pageStructure.forEach((item, ix) => {
      if (ix != BaseSubscreen.currentPage - 1) {
        item.forEach((setting) => {
          elementHide({ elementId: `${setting.id}-container` });
        });
      } else {
        item.forEach((setting) => {
          elementUnhide({ elementId: `${setting.id}-container` });
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

    elementCreateSubscreenDiv();
    const settingsElement = elementCreateSettingsDiv();
    elementAppendToSubscreenDiv(settingsElement);
    
    if (this.pageStructure.length > 1) {
      const prev = elementCreateButton({
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
      elementAppendToSubscreenDiv(prev);

      const pageLabel = elementCreateLabel({
        type: 'label',
        id: 'deeplib-page-label',
        position: [1585, 75],
        size: [110, 90],
        label: `${BaseSubscreen.currentPage} of ${this.pageStructure.length}`,

      });
      elementAppendToSubscreenDiv(pageLabel);
      
      const next = elementCreateButton({
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
      elementAppendToSubscreenDiv(next);
    }

    const subscreenTitle = elementCreateLabel({
      type: 'label',
      id: 'deeplib-subscreen-title',
      label: getText('mainmenu.title').replace('$ModVersion', bcSdkMod.ModInfo.version) + '  ' + SupportHelper.getSupporter(),
    });
    elementAppendToSubscreenDiv(subscreenTitle);

    if (this.name !== 'mainmenu') {
      const exitButton = elementCreateButton({
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
      elementAppendToSubscreenDiv(exitButton);
    }

    const tooltip = elementCreateTooltip();
    elementAppendToSubscreenDiv(tooltip);

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
      })
    );

    this.managePageElementsVisibility();
    CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
  }

  run() {
    const newTitle = getText('mainmenu.title').replace('$ModVersion', bcSdkMod.ModInfo.version) + '  ' + SupportHelper.getSupporter();
    const oldTitle = ElementContent('deeplib-subscreen-title');
    if (newTitle !== oldTitle) {
      ElementContent('deeplib-subscreen-title', newTitle);
    }
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

    elementSetPosSizeFont({ element: elementGetSubscreenDiv() }, 0, 0, 2000, 1000);
    if (this.name === 'mainmenu') {
      elementSetPosition({ element: elementGetSettingsDiv() }, 530 - offset, 170);
      elementSetSize({ element: elementGetSettingsDiv() }, 800 + offset, 660);
    } else {
      elementSetPosition({ element: elementGetSettingsDiv() }, 530 - offset, 170);
      elementSetSize({ element: elementGetSettingsDiv() }, 1000 + offset, 660);
    }

    elementSetPosition({ elementId: 'deeplib-subscreen-title' }, 530 - offset, 75); 
    elementSetSize({ elementId: 'deeplib-subscreen-title' }, 800, 60);
    
    elementSetPosition({ element: elementGetTooltip() }, 250, 850);
    elementSetSize({ element: elementGetTooltip() }, 1500, 70);

    BaseSubscreen.currentElements.forEach((item) => {
      const options = item[1];
      const elementDataAttrs = item[0].dataset;
      
      if (options.position || elementDataAttrs.position) {
        const position = elementDataAttrs?.position?.split('x');
        const xPos = options?.position?.[0] || parseInt(position?.[0] || 0);
        const yPos = options?.position?.[1] || parseInt(position?.[1] || 0);

        elementSetPosition({ elementId: options.id }, xPos, yPos);
      }

      if (options.size || elementDataAttrs.size) {
        const size = elementDataAttrs?.size?.split('x');
        const width = options?.size?.[0] || (size?.[0] ? parseInt(size?.[0] || 0) : null);
        const height = options?.size?.[1] || (size?.[1] ? parseInt(size?.[1] || 0) : null);

        elementSetSize({ elementId: options.id }, width, height);
      }
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

