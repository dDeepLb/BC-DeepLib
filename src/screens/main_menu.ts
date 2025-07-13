
import { BaseSubscreen, getText, GUI, GuiDebug, layoutElement } from '../deeplib';
import { advancedElement } from '../utilities/elements/advanced_elements';

export type MainMenuOptions = {
  repoLink?: string;
  wikiLink?: string;
  resetSubscreen?: BaseSubscreen;
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

    const exitButton = advancedElement.createButton({
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

      const button = advancedElement.createButton({
        id: `${screen.name}-button`,
        image: screen.icon,
        label: getText(`mainmenu.button.${screen.name}`),
        onClick: () => {
          this.setSubscreen(screen);
        },
        size: [null, 90],
      });

      layoutElement.appendToSettingsDiv(button);
    }

    const miscDiv = layoutElement.createMiscDiv();
    layoutElement.appendToSubscreenDiv(miscDiv);

    if (MainMenu.options.wikiLink) {
      const wikiButton = advancedElement.createButton({
        id: 'deeplib-wiki-button',
        image: `${PUBLIC_URL}/dl_images/notebook.svg`,
        label: getText('mainmenu.button.wiki'),
        onClick: () => {
          window.open(MainMenu.options.wikiLink, '_blank');
        },
        size: [null, 80],
      });
      layoutElement.appendToMiscDiv(wikiButton);
    }

    if (MainMenu.options.repoLink) {
      const repoButton = advancedElement.createButton({
        id: 'deeplib-repo-button',
        image: `${PUBLIC_URL}/dl_images/git.svg`,
        label: getText('mainmenu.button.repo'),
        onClick: () => {
          window.open(MainMenu.options.repoLink, '_blank');
        },
        size: [null, 80],
      });
      layoutElement.appendToMiscDiv(repoButton);
    }

    if (MainMenu.options.resetSubscreen) {
      const resetButton = advancedElement.createButton({
        id: 'deeplib-reset-button',
        image: `${PUBLIC_URL}/dl_images/trash_bin.svg`,
        label: getText('mainmenu.button.reset'),
        onClick: () => {
          this.setSubscreen(MainMenu.options.resetSubscreen!);
        },
        size: [null, 80],
      });
      layoutElement.appendToMiscDiv(resetButton);
    }

    if (IS_DEVEL) {
      const debugButton = advancedElement.createButton({
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
