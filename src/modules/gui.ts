import { BaseModule, BaseSubscreen, MainMenu, modules, setSubscreen } from '../deeplib';

type ModButtonOptions = {
  Identifier: string;
  ButtonText: string | (()=>string);
  Image: string | (()=>string);

  load?: () => void;
  click?: () => void;
  run?: () => void;
  unload?: () => void;
  exit?: () => boolean | void;
};

export class GUI extends BaseModule {
  static instance: GUI | null = null;

  private _subscreens: BaseSubscreen[];
  private _mainMenu: MainMenu;
  private _currentSubscreen: BaseSubscreen | null = null;
  private _modButtonOptions: ModButtonOptions;

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
      this._currentSubscreen.unload();
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

    if (this._currentSubscreen) {
      this._currentSubscreen.load();
      this._currentSubscreen.resize(true);
    }
  }

  constructor(modButtonOptions: ModButtonOptions) {
    super();
    if (GUI.instance) {
      throw new Error('Duplicate initialization');
    }

    for (const module of modules()) {
      if (!module.settingsScreen) continue;
    }

    this._mainMenu = new MainMenu(this);
    this._subscreens = [this._mainMenu];
    this._modButtonOptions = modButtonOptions;

    GUI.instance = this;
  }

  get defaultSettings(): null {
    return null;
  }

  load(): void {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;

      this._subscreens.push(new module.settingsScreen({}, module));
    }

    this._mainMenu.subscreens = this._subscreens;
    PreferenceRegisterExtensionSetting({
      Identifier: this._modButtonOptions.Identifier,
      ButtonText: this._modButtonOptions.ButtonText,
      Image: this._modButtonOptions.Image,
      load: this._modButtonOptions.load || (() => {
        setSubscreen(new MainMenu(this));
      }),
      run: this._modButtonOptions.run || (() => {
        if (this._currentSubscreen) {
          MainCanvas.textAlign = 'left';
          this._currentSubscreen.run();
          MainCanvas.textAlign = 'center';
          
          const newCanvasPosition: RectTuple = [MainCanvas.canvas.offsetLeft, MainCanvas.canvas.offsetTop, MainCanvas.canvas.clientWidth, MainCanvas.canvas.clientHeight];
          if (!CommonArraysEqual(newCanvasPosition, DrawCanvasPosition)) {
            DrawCanvasPosition = newCanvasPosition;
            this._currentSubscreen.resize(false);
          }
        }
      }),
      click: this._modButtonOptions.click || (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.click();
        }
      }),
      exit: this._modButtonOptions.exit || (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.exit();
        }
      }),
      unload: this._modButtonOptions.unload || (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.unload();
        }
      })
    });
  }
}
