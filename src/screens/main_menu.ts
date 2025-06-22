
import { BaseSubscreen, domUtil, getText, GUI, GuiDebug, layoutElement } from '../deep_lib';
import { advancedElement } from '../utilities/elements/advanced_elements';

export class MainMenu extends BaseSubscreen {
  subscreens: BaseSubscreen[] = [];

  static wikiLink: string = '';
  static resetSubscreen: BaseSubscreen | null = null;

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
      type: 'button',
      id: 'exit',
      position: [1815, 75],
      size: [90, 90],
      image: 'Icons/Exit.png',
      onClick: () => {
        this.exit();
      },
      tooltip: getText('settings.button.back_button_hint')
    });
    layoutElement.appendToSubscreenDiv(exitButton);

    for (const screen of this.subscreens) {

      if (screen.name == 'mainmenu') continue;

      const button = advancedElement.createButton({
        type: 'button',
        id: `${screen.name}-button`,
        image: screen.icon,
        label: getText(`mainmenu.button.${screen.name}`),
        onClick: () => {
          this.setSubscreen(screen);
        },
        size: [450, 90],
      });

      layoutElement.appendToSettingsDiv(button);
    }

    const miscDiv = layoutElement.createMiscDiv();
    layoutElement.appendToSubscreenDiv(miscDiv);

    if (MainMenu.resetSubscreen) {
      const resetButton = advancedElement.createButton({
        type: 'button',
        id: 'deeplib-reset-button',
        image: 'Icons/ServiceBell.png',
        label: 'Reset',
        onClick: () => {
          this.setSubscreen(MainMenu.resetSubscreen);
        },
        size: [405, 80],
      });
      layoutElement.appendToMiscDiv(resetButton);
    }

    if (MainMenu.wikiLink) {
      const wikiButton = advancedElement.createButton({
        type: 'button',
        id: 'deeplib-wiki-button',
        image: 'Icons/Introduction.png',
        label: 'Wiki',
        onClick: () => {
          window.open(MainMenu.wikiLink, '_blank');
        },
        size: [405, 80],
      });
      layoutElement.appendToMiscDiv(wikiButton);
    }

    const debugButton = advancedElement.createButton({
      type: 'button',
      id: 'deeplib-debug-button',
      image: 'Assets/Female3DCG/Emoticon/Coffee/Icon.png',
      onClick: () => {
        this.setSubscreen(new GuiDebug());
      },
      size: [90, 90],
      position: [75, 75],
    });
    layoutElement.appendToMiscDiv(debugButton);
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
    ElementSetPosition('deeplib-misc', 1500, 670);
    ElementSetSize('deeplib-misc', 405, 260);
  }
}

export function setMainMenuOptions(wikiLink: string, resetSubscreen: BaseSubscreen | null) {
  MainMenu.wikiLink = wikiLink;
  MainMenu.resetSubscreen = resetSubscreen;
}
