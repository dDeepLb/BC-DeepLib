import { BaseModule, BaseSubscreen, bcSdkMod, getText, HookPriority, MainMenu, modules, RibbonMenu, setSubscreen, SETTING_NAME_PREFIX } from '../DeepLib';

export class GUI extends BaseModule {
  static instance: GUI | null = null;

  private _subscreens: BaseSubscreen[];
  private _mainMenu: MainMenu;
  private _currentSubscreen: BaseSubscreen | null = null;

  get subscreens(): BaseSubscreen[] {
    return this._subscreens;
  }

  get mainMenu(): MainMenu {
    return this._mainMenu;
  }

  get currentSubscreen(): BaseSubscreen | null {
    return this._currentSubscreen;
  }

  set currentSubscreen(subscreen: BaseSubscreen | string | null) {
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

  constructor() {
    super();
    if (GUI.instance) {
      throw new Error('Duplicate initialization');
    }

    for (const module of modules()) {
      if (!module.settingsScreen) continue;
    }

    this._mainMenu = new MainMenu(this);
    this._subscreens = [this._mainMenu];

    GUI.instance = this;
  }

  get defaultSettings(): null {
    return null;
  }

  load(): void {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;

      this._subscreens.push(new module.settingsScreen(module));
    }

    this._mainMenu.subscreens = this._subscreens;

    const modIndex = RibbonMenu.getModIndex('Responsive');

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

      RibbonMenu.handleModClick(modIndex, () => {
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


    window.addEventListener('resize', () => {
      if (this._currentSubscreen) {
        this._currentSubscreen.OnResize();
        return;
      }
    });
  }
}
