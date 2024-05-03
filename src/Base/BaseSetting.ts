import { Label, SettingElement } from '../../.types/elements';
import { BaseSettingsModel } from '../Models/Base';
import { modules } from './Modules';
import { dataStore } from '../Utilities/Data';
import { BaseModule } from './BaseModule';
import { SETTING_FUNC_NAMES, SETTING_FUNC_PREFIX, SETTING_NAME_PREFIX, setSubscreen } from './SettingDefinitions';
import { GUI } from './SettingUtils';
import { getText } from '../Utilities/Translation';
import { elementAppendToSettingsDiv, elementAppendToSubscreenDiv, elementCreateButton, elementCreateCheckbox, elementCreateInput, elementCreateLabel, elementCreateSettingsDiv, elementCreateSubscreenDiv, elementRemoveSubscreenDiv } from '../Utilities/SettingElement';
import { bcSdkMod } from '../Utilities/SDK';

export abstract class GuiSubscreen {
  static subscreenElement: HTMLElement;
  static settingsElement: HTMLElement;
  static START_X: number = 180;
  static START_Y: number = 205;
  static X_MOD: number = 950;
  static Y_MOD: number = 75;
  static POS_BAK: number = GuiSubscreen.START_X;
  static TEXT_ALIGN_BAK: CanvasTextAlign;
  readonly module!: BaseModule;

  constructor(module?: BaseModule) {
    if (module) this.module = module;

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

  get label(): string {
    return 'UNDEFINED SETTING SCREEN';
  }

  get SubscreenName(): string {
    return SETTING_NAME_PREFIX + this.constructor.name;
  }

  setSubscreen(screen: GuiSubscreen | string | null) {
    return setSubscreen(screen);
  }

  get settings(): BaseSettingsModel {
    return this.module.settings as BaseSettingsModel;
  }

  get multipageStructure(): SettingElement[][] {
    return [[]];
  }

  get structure(): SettingElement[] {
    return this.multipageStructure[Math.min(PreferencePageCurrent - 1, this.multipageStructure.length - 1)];
  }

  get character(): Character {
    return GUI.instance?.currentCharacter as Character;
  }

  getYPos(ix: number) {
    return GuiSubscreen.START_Y + GuiSubscreen.Y_MOD * (ix % 9);
  }

  getXPos(ix: number) {
    return GuiSubscreen.START_X + GuiSubscreen.X_MOD * Math.floor(ix / 9);
  }

  hideElements() {
    this.multipageStructure.forEach((item, ix, arr) => {
      if (ix != PreferencePageCurrent - 1) {
        item.forEach((setting) => {
          this.elementHide(setting.id);
        });
      }
    });
  }

  Load() {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;
      if (!module.settings || !Object.keys(module.settings).length) module.registerDefaultSettings();
    }

    /* GuiSubscreen.subscreenElement = elementCreateSubscreenDiv();

    GuiSubscreen.settingsElement = elementCreateSettingsDiv();
    GuiSubscreen.settingsElement.style.backgroundColor = '#440171';
    elementAppendToSubscreenDiv(GuiSubscreen.settingsElement);

    const exitButton = elementCreateButton({
      type: 'button',
      id: 'exit',
      image: 'Icons/Exit.png',
      onClick: () => {
        this.setSubscreen(null);
      },
      hoverHint: getText('settings.button.back_button_hint')
    });
    elementAppendToSubscreenDiv(exitButton);

    this.multipageStructure.forEach((s) =>
      s.forEach((item) => {
        switch (item.type) {
          case 'text':
          case 'number':
            let input = elementCreateInput(item);
            elementAppendToSettingsDiv(input);
            break;
          case 'checkbox':
            let checkbox = elementCreateCheckbox(item);
            elementAppendToSettingsDiv(checkbox);
            break;
          case 'button':
            let button = elementCreateButton(item);
            elementAppendToSettingsDiv(button);
            break;
          case 'label':
            let label = elementCreateLabel(item);
            elementAppendToSettingsDiv(label);
        }
      })
    );

    CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1; */
  }

  Run() {
    /* ElementPositionFixed(GuiSubscreen.subscreenElement.id, 0, 0, 2000, 1000);
    ElementPositionFixed(GuiSubscreen.settingsElement.id, 530, 170, 800, 830);
    GuiSubscreen.POS_BAK = GuiSubscreen.START_X;
    GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;

    GuiSubscreen.START_X = 550;
    MainCanvas.textAlign = 'left';

    DrawCharacter(Player, 50, 50, 0.9, false);
    DrawText(
      getText(`${this.name}.title`).replace('$ModVersion', bcSdkMod.ModInfo.version) + '  ' + SupportHelper.getSupporter(),
      GuiSubscreen.START_X, GuiSubscreen.START_Y - GuiSubscreen.Y_MOD, 'Black', '#D7F6E9'
    );
    DrawButton(1815, 75, 90, 90, '', 'White', 'Icons/Exit.png', 'Responsive');

    if (this.multipageStructure.length > 1) {
      MainCanvas.textAlign = 'center';
      PreferencePageChangeDraw(1595, 75, this.multipageStructure.length);
      MainCanvas.textAlign = 'left';
    }

    this.hideElements();

    this.structure.forEach((item, ix, arr) => {
      switch (item.type) {
        case 'checkbox':
        case 'text':
        case 'number':
        case 'label':
        case 'button':
          if (item.position && item.size)
            ElementPositionFixed(item.id, item.position[0], item.position[1], item.size[0], item.size[1]);
          break;
      }
    });

    GuiSubscreen.START_X = GuiSubscreen.POS_BAK;
    MainCanvas.textAlign = GuiSubscreen.TEXT_ALIGN_BAK; */
  }

  Click() {
    /* GuiSubscreen.POS_BAK = GuiSubscreen.START_X;
    GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;

    GuiSubscreen.START_X = 550;
    MainCanvas.textAlign = 'left';

    if (MouseIn(1815, 75, 90, 90)) return this.Exit();
    if (this.multipageStructure.length > 1) PreferencePageChangeClick(1595, 75, this.multipageStructure.length);

    this.structure.forEach((item, ix, arr) => {
      switch (item.type) {
        case 'checkbox':
          if (MouseIn(this.getXPos(ix) + 600, this.getYPos(ix) - 32, 64, 64) && !item.disabled) {
            item.setSettingValue(!item.setElementValue());
          }
          break;
        case 'button':
          // if (MouseIn(item.position[0], item.position[1], item.size[0], item.size[1])) item.callback();
          break;
      }
    });

    GuiSubscreen.START_X = GuiSubscreen.POS_BAK;
    MainCanvas.textAlign = GuiSubscreen.TEXT_ALIGN_BAK; */
  }

  Exit() {
    /* this.multipageStructure.forEach((s) =>
      s.forEach((item) => {
        switch (item.type) {
          case 'number':
            if (!CommonIsNumeric(ElementValue(item.id))) {
              ElementRemove(item.id);
              break;
            }
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
    dataStore(); */
  }

  // OnScreenChange() {
  //   // elementRemoveSubscreenDiv();
  // }

  Unload() { }

  elementHide(elementId: string) {
    ElementPosition(elementId, -999, -999, 1, 1);
  }

  elementPosition(elementId: string, label: string, description: string, order: number, disabled: boolean = false) {
    var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
    DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? 'Red' : 'Black', 'Gray');
    ElementPosition(elementId, this.getXPos(order) + 750 + 225, this.getYPos(order), 800, 64);
    if (disabled) ElementSetAttribute(elementId, 'disabled', 'true');
    if (!disabled) document.getElementById(elementId)?.removeAttribute('disabled');
  }
}

