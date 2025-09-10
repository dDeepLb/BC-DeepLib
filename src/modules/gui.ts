import { BaseModule, BaseSubscreen, MainMenu, modules, setSubscreen } from '../deeplib';

/** Options for configuring a mod's main button in the extensions menu. */
type GuiOptions = {

  /**
   * Unique identifier for the mod's settings button.
   * Used internally by the preference system to track the button.
   */
  Identifier: string;

  /**
   * The label displayed on the settings button.
   * Can be a string or a function that returns a string dynamically.
   */
  ButtonText: string | (() => string);

  /** 
   * The path to or Base64 data of the icon for the settings button.
   * Can be a string or a function that returns a string dynamically.
   */
  Image: string | (() => string);
  mainMenu: typeof MainMenu;
};

/**
 * Central mod GUI controller that manages all subscreens.
 *
 * This module is responsible for:
 * - Registering the mod's settings button in the game's preferences.
 * - Managing subscreens (including settings screens for all registered modules).
 * - Routing lifecycle events (load, run, click, exit, unload) to the active subscreen.
 */
export class GUI extends BaseModule {
  /** The singleton instance of the GUI controller. */
  static instance: GUI | null = null;

  /** All subscreens managed by this GUI, including the main menu and module settings screens. */
  private _subscreens: BaseSubscreen[];
  /** The mod's main menu screen. */
  private _mainMenu: MainMenu;
  /** The currently active subscreen, or `null` if none is active. */
  private _currentSubscreen: BaseSubscreen | null = null;
  /** Options defining how the mod's settings button is displayed and behaves. */
  private _modButtonOptions: GuiOptions;

  /** Returns all registered subscreens. */
  get subscreens(): BaseSubscreen[] {
    return this._subscreens;
  }

  /** Returns the main menu subscreen instance. */
  get mainMenu(): MainMenu {
    return this._mainMenu;
  }

  /** Returns the currently active subscreen. */
  get currentSubscreen(): BaseSubscreen | null {
    return this._currentSubscreen;
  }

  /**
   * Sets the current subscreen.
   * Accepts either a `BaseSubscreen` instance or the `name` of a subscreen.
   *
   * @throws If a string is provided but no subscreen with that name exists.
   */
  set currentSubscreen(subscreen: BaseSubscreen | string | null) {
    if (this._currentSubscreen) {
      this._currentSubscreen.unload();
    }

    if (typeof subscreen === 'string') {
      const scr = this._subscreens?.find((s) => s.options.name === subscreen);
      if (!scr) throw `Failed to find screen name ${subscreen}`;
      this._currentSubscreen = scr;
    } else {
      this._currentSubscreen = subscreen;
    }

    if (this._currentSubscreen) {
      this._currentSubscreen.load();
      this._currentSubscreen.resize(true);
    }
  }

  /** 
   * Creates the GUI instance and initializes the main menu. 
   * 
   * @throws If another `GUI` instance already exists.
   */
  constructor(guiOptions: GuiOptions) {
    super();
    if (GUI.instance) {
      throw new Error('Duplicate initialization');
    }

    for (const module of modules()) {
      if (!module.settingsScreen) continue;
    }

    this._mainMenu = guiOptions.mainMenu ? new guiOptions.mainMenu(this) : new MainMenu(this);
    this._subscreens = [this._mainMenu];
    this._modButtonOptions = guiOptions;

    GUI.instance = this;
  }

  /**
   * Loads the GUI and registers the mod's settings button in the extensions menu.
   *
   * - Creates subscreens for each module's settings screen.
   * - Registers lifecycle callbacks for subscreens events.
   * - Sets up the main menu and its subscreens.
   */
  load(): void {
    for (const module of modules()) {
      if (!module.settingsScreen) continue;

      this._subscreens.push(new module.settingsScreen(module));
    }

    this._mainMenu.subscreens = this._subscreens;
    PreferenceRegisterExtensionSetting({
      Identifier: this._modButtonOptions.Identifier,
      ButtonText: this._modButtonOptions.ButtonText,
      Image: this._modButtonOptions.Image,
      load: (() => {
        setSubscreen(this._mainMenu);
      }),
      run: (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.run();

          const newCanvasPosition: RectTuple = [MainCanvas.canvas.offsetLeft, MainCanvas.canvas.offsetTop, MainCanvas.canvas.clientWidth, MainCanvas.canvas.clientHeight];
          if (!CommonArraysEqual(newCanvasPosition, DrawCanvasPosition)) {
            DrawCanvasPosition = newCanvasPosition;
            this._currentSubscreen.resize(false);
          }
        }
      }),
      click: (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.click();
        }
      }),
      exit: (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.exit();
        }
      }),
      unload: (() => {
        if (this._currentSubscreen) {
          this._currentSubscreen.unload();
        }
      })
    });
  }
}
