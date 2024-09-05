
import { Checkbox, SettingElement } from 'Types/elements';
import { BaseSubscreen, GUI, GuiSupport, elementAppendToMiscDiv, elementAppendToSettingsDiv, elementAppendToSubscreenDiv, elementCreateButton, elementCreateMiscDiv, elementSetPosSizeFont, getText } from '../DeepLib';

export class MainMenu extends BaseSubscreen {
  subscreens: BaseSubscreen[] = [];

  static wikiLink: string = '';
  static resetSubscreen: BaseSubscreen | null = null;

  get name(): string {
    return 'mainmenu';
  }

  constructor(module: GUI) {
    super(module);

    this.subscreens = module.subscreens;
  }

  load(): void {
    if (!GUI.instance?.currentSubscreen) {
      this.setSubscreen(this);
      return;
    }

    super.load();

    const exitButton = elementCreateButton({
      type: 'button',
      id: 'exit',
      position: [1815, 75],
      size: [90, 90],
      image: 'Icons/Exit.png',
      onClick: () => {
        this.exit();
      },
      hoverHint: getText('settings.button.back_button_hint')
    });
    elementAppendToSubscreenDiv(exitButton);

    for (const screen of this.subscreens) {

      if (screen.name == 'mainmenu') continue;

      const button = elementCreateButton({
        type: 'button',
        id: `${screen.name}-button`,
        image: screen.icon,
        label: getText(`mainmenu.button.${screen.name}`),
        onClick: () => {
          this.setSubscreen(screen);
        },
        size: [450, 90],
      });

      elementAppendToSettingsDiv(button);
    }

    const miscDiv = elementCreateMiscDiv();
    elementAppendToSubscreenDiv(miscDiv);

    if (MainMenu.resetSubscreen) {
      const resetButton = elementCreateButton({
        type: 'button',
        id: 'deeplib-reset-button',
        image: 'Icons/ServiceBell.png',
        label: 'Reset',
        onClick: () => {
          this.setSubscreen(MainMenu.resetSubscreen);
        },
        size: [405, 80],
      });
      elementAppendToMiscDiv(resetButton);
    }

    if (MainMenu.wikiLink) {
      const wikiButton = elementCreateButton({
        type: 'button',
        id: 'deeplib-wiki-button',
        image: 'Icons/Introduction.png',
        label: 'Wiki',
        onClick: () => {
          window.open(MainMenu.wikiLink, '_blank');
        },
        size: [405, 80],
      });
      elementAppendToMiscDiv(wikiButton);
    }

    const supportButton = elementCreateButton({
      type: 'button',
      id: 'deeplib-support-button',
      image: 'Assets/Female3DCG/Emoticon/Coffee/Icon.png',
      label: 'Support',
      onClick: () => {
        this.setSubscreen(new GuiSupport());
      },
      size: [405, 80],
    });
    elementAppendToMiscDiv(supportButton);
    elementSetPosSizeFont({ elementId: 'deeplib-misc' }, 1500, 670, 405, 260);

    const debugButton = elementCreateButton({
      type: 'button',
      id: 'deeplib-debug-button',
      image: 'Assets/Female3DCG/Emoticon/Coffee/Icon.png',
      onClick: () => {
        this.setSubscreen(new GuiDebug());
      },
      size: [90, 90],
      position: [75, 75],
    });
    elementAppendToMiscDiv(debugButton);
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
    elementSetPosSizeFont({ elementId: 'deeplib-misc' }, 1500, 670, 405, 260);
  }
}

export function setMainMenuOptions(wikiLink: string, resetSubscreen: BaseSubscreen | null) {
  MainMenu.wikiLink = wikiLink;
  MainMenu.resetSubscreen = resetSubscreen;
}
