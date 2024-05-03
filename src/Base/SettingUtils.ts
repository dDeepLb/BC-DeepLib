import { BaseModule } from './BaseModule';
import { modules } from './Modules';
import { RibbonMenu } from '../Utilities/RibbonMenu.js';
import { HookPriority, bcSdkMod } from '../Utilities/SDK.js';
import { MainMenu } from '../Screens/MainMenu.js';
import { GuiSubscreen } from './BaseSetting';
import { setSubscreen, SETTING_NAME_PREFIX } from './SettingDefinitions';
import { getText } from '../Utilities/Translation';

export class GUI extends BaseModule {
  static instance: GUI | null = null;

  private _subscreens: GuiSubscreen[];
  private _mainMenu: MainMenu;
  private _currentSubscreen: GuiSubscreen | null = null;

  get subscreens(): GuiSubscreen[] {
    return this._subscreens;
  }

  get mainMenu(): MainMenu {
    return this._mainMenu;
  }

  get currentSubscreen(): GuiSubscreen | null {
    return this._currentSubscreen;
  }

  set currentSubscreen(subscreen: GuiSubscreen | string | null) {
    if (this._currentSubscreen) {
      this._currentSubscreen.Unload();
    }
    if (typeof subscreen === 'string') {
      const scr = this._subscreens?.find((s) => s.name === subscreen);
      if (!scr) throw `Failed to find screen name ${subscreen}`;
      this._currentSubscreen = scr;
    } else {
      this._currentSubscreen = subscreen;
    }

    PreferenceMessage = '';
    PreferencePageCurrent = 1;

    let subscreenName = '';
    if (this._currentSubscreen) {
      subscreenName = SETTING_NAME_PREFIX + this._currentSubscreen?.name;
      this._currentSubscreen.Load();
    }

    PreferenceSubscreen = subscreenName as PreferenceSubscreenName;
  }

  get currentCharacter(): Character {
    return Player;
  }

  constructor() {
    super();
    if (GUI.instance) {
      throw new Error('Duplicate initialization');
    }

    this._mainMenu = new MainMenu(this);
    this._subscreens = [this._mainMenu];

    GUI.instance = this;
  }

  get defaultSettings(): null {
    return null;
  }

  Load(): void {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;

      this._subscreens.push(new module.settingsScreen(module));
    }

    this._mainMenu.subscreens = this._subscreens;

    let modIndex = RibbonMenu.getModIndex('Responsive');

    bcSdkMod.prototype.hookFunction('PreferenceRun', HookPriority.OverrideBehavior, (args, next) => {
      if (this._currentSubscreen) {
        MainCanvas.textAlign = 'left';
        this._currentSubscreen.Run();
        MainCanvas.textAlign = 'center';

        return;
      }

      next(args);

      RibbonMenu.drawModButton(modIndex, (modIndex) => {
        DrawButton(1815, RibbonMenu.getYPos(modIndex), 90, 90, '', 'White', 'Icons/Arousal.png', getText('infosheet.button.mod_button_hint'));
      });
    });

    bcSdkMod.prototype.hookFunction('PreferenceClick', HookPriority.OverrideBehavior, (args, next) => {
      if (this._currentSubscreen) {
        this._currentSubscreen.Click();
        return;
      }

      next(args);

      RibbonMenu.handleModClick(modIndex, (modIndex) => {
        setSubscreen(new MainMenu(this));
      });
    });

    bcSdkMod.prototype.hookFunction('InformationSheetExit', HookPriority.OverrideBehavior, (args, next) => {
      if (this._currentSubscreen) {
        this._currentSubscreen.Exit();
        return;
      }
      return next(args);
    });
  }
}
