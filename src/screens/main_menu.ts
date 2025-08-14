
import { BaseSubscreen, getText, GUI, GuiDebug, layout } from '../deeplib';
import { advElement } from '../utilities/elements/elements';
import { GuiImportExport } from './import_export';

/**
 * Configuration options for the main menu.
 * 
 * If these are defined, new button for each option will be added to the main menu.
 */
export type MainMenuOptions = {
  /**
   * Optional URL to the project's repository.
   * Example: "https://github.com/user/project"
   */
  repoLink?: string;

  /**
   * Optional URL to the project's wiki or documentation.
   * Example: "https://github.com/user/project/wiki"
   */
  wikiLink?: string;

  /**
   * Optional subscreen to use for the "reset" action.
   */
  resetSubscreen?: BaseSubscreen;

  /**
   * Optional subscreen for import/export functionality.
   * Provides tools to import or export data to or from the mod.
   */
  importExportSubscreen?: GuiImportExport;
};

export class MainMenu extends BaseSubscreen {
  subscreens: BaseSubscreen[] = [];

  private static options: MainMenuOptions = {};

  get name(): string {
    return 'mainmenu';
  }

  constructor(module: GUI) {
    super({ drawCharacter: true }, module);

    this.subscreens = module.subscreens;
  }

  load(): void {
    if (!GUI.instance?.currentSubscreen) {
      this.setSubscreen(this);
      return;
    }

    super.load();

    const exitButton = advElement.createButton({
      id: 'exit',
      size: [90, 90],
      image: `${PUBLIC_URL}/dl_images/exit.svg`,
      onClick: () => {
        this.exit();
      },
      tooltip: getText('settings.button.back_button_hint')
    });

    const menu = document.getElementById('deeplib-nav-menu');
    if (menu) {
      ElementMenu.AppendButton(menu, exitButton);
    }

    for (const screen of this.subscreens) {

      if (screen.name == 'mainmenu') continue;

      const button = advElement.createButton({
        id: `${screen.name}-button`,
        image: screen.icon,
        label: getText(`mainmenu.button.${screen.name}`),
        onClick: () => {
          this.setSubscreen(screen);
        },
        size: [null, 90],
      });

      layout.appendToSettingsDiv(button);
    }

    const miscDiv = layout.createMiscDiv();
    layout.appendToSubscreen(miscDiv);

    if (MainMenu.options.wikiLink) {
      const wikiButton = advElement.createButton({
        id: 'deeplib-wiki-button',
        image: `${PUBLIC_URL}/dl_images/notebook.svg`,
        label: getText('mainmenu.button.wiki'),
        onClick: () => {
          window.open(MainMenu.options.wikiLink, '_blank');
        },
        size: [null, 80],
      });
      layout.appendToMiscDiv(wikiButton);
    }

    if (MainMenu.options.repoLink) {
      const repoButton = advElement.createButton({
        id: 'deeplib-repo-button',
        image: `${PUBLIC_URL}/dl_images/git.svg`,
        label: getText('mainmenu.button.repo'),
        onClick: () => {
          window.open(MainMenu.options.repoLink, '_blank');
        },
        size: [null, 80],
      });
      layout.appendToMiscDiv(repoButton);
    }

    if (MainMenu.options.resetSubscreen) {
      const resetButton = advElement.createButton({
        id: 'deeplib-reset-button',
        image: `${PUBLIC_URL}/dl_images/trash_bin.svg`,
        label: getText('mainmenu.button.reset'),
        onClick: () => {
          this.setSubscreen(MainMenu.options.resetSubscreen!);
        },
        size: [null, 80],
      });
      layout.appendToMiscDiv(resetButton);
    }

    if (MainMenu.options.importExportSubscreen) {
      const importExportButton = advElement.createButton({
        id: 'deeplib-import-export-button',
        image: `${PUBLIC_URL}/dl_images/transfer.svg`,
        label: getText('mainmenu.button.import_export'),
        onClick: () => {
          this.setSubscreen(MainMenu.options.importExportSubscreen!);
        },
        size: [null, 80],
      });
      layout.appendToMiscDiv(importExportButton);
    }

    if (IS_DEBUG) {
      const debugButton = advElement.createButton({
        id: 'deeplib-debug-button',
        image: `${PUBLIC_URL}/dl_images/bug.svg`,
        onClick: () => {
          this.setSubscreen(new GuiDebug());
        },
        size: [90, 90],
      });
      if (menu) {
        ElementMenu.PrependItem(menu, debugButton);
      }
    }
  }

  run() {
    super.run();
  }

  click() { }

  exit(): void {
    CharacterAppearanceForceUpCharacter = -1;
    CharacterLoadCanvas(Player);
    this.setSubscreen(null);
    PreferenceSubscreenExtensionsClear();
  }

  resize(): void {
    super.resize();
    ElementSetPosition('deeplib-misc', 1905, 930, 'bottom-right');
    ElementSetSize('deeplib-misc', 405, null);
  }

  static setOptions(mainMenuOptions: MainMenuOptions) {
    MainMenu.options = mainMenuOptions;
  }
}
