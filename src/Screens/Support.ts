import { Button, SettingElement } from '../../.types/elements';
import { GuiSubscreen } from '../Base/BaseSetting.js';
import { getText } from '../Utilities/Translation.js';

export class SupportHelper {
  private static thankYouList: string[] = ['Ellena', 'weboos'];
  private static thankYouNext = 0;
  private static thankYou = '';

  static getSupporter() {
    if (SupportHelper.thankYouNext < CommonTime()) SupportHelper.doNextThankYou();
    return `${getText('support.other.thankyou')}, ${SupportHelper.thankYou}`;
  }

  static doNextThankYou() {
    if (SupportHelper.thankYou && SupportHelper.thankYouList.length < 2) return;
    SupportHelper.thankYou = CommonRandomItemFromList(SupportHelper.thankYou, SupportHelper.thankYouList);
    SupportHelper.thankYouNext = CommonTime() + 4000;
  }
}

export class GuiSupport extends GuiSubscreen {
  get name(): string {
    return 'Support';
  }

  /* get structure(): Element[] {
    return [
      <any>{
        type: 'button',
        position: [GuiSubscreen.START_X, GuiSubscreen.START_Y],
        size: [405, 80],
        label: 'support.button.ko-fi',
        color: '#49225C',
        image: 'https://storage.ko-fi.com/cdn/nav-logo-stroke.png',
        disabled: false,
        callback() {
          window.open('https://ko-fi.com/monikka_bc', '_blank');
        }
      },
      <any>{
        type: 'button',
        position: [GuiSubscreen.START_X, GuiSubscreen.START_Y + GuiSubscreen.Y_MOD + 20],
        size: [405, 80],
        label: 'support.button.patreon',
        color: '#49225C',
        image: 'https://c5.patreon.com/external/favicon/rebrand/favicon-32.png?v=af5597c2ef',
        disabled: false,
        callback() {
          window.open('https://patreon.com/monikka_bc', '_blank');
        }
      }
    ];
  } */

  Load() {
    SupportHelper.doNextThankYou();

    ElementCreateDiv('DeepLibGratitude');
    let elm = document.getElementById('DeepLibGratitude') as HTMLElement;
    ElementContent('DeepLibGratitude', gratitudeHtml);

    const font =
      MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2
        ? MainCanvas.canvas.clientWidth / 50
        : MainCanvas.canvas.clientHeight / 25;

    Object.assign(elm.style, <CSSStyleDeclaration>{
      fontFamily: CommonGetFontName(),
      fontSize: font + 'px'
    });

    super.Load();
  }

  Run() {
    super.Run();

    let tmp = GuiSubscreen.START_X;
    GuiSubscreen.START_X = 550;

    DrawText(SupportHelper.getSupporter(), GuiSubscreen.START_X + 300, GuiSubscreen.START_Y - GuiSubscreen.Y_MOD, 'Black', '#D7F6E9');

    GuiSubscreen.START_X = tmp;
  }

  Click() {
    super.Click();
  }

  Exit() {
    ElementRemove('Gratitude');
    super.Exit();
  }
}

const gratitudeHtml = /*html*/ `
<h1 class="ResponsiveH">Dear Supporters!</h1>
<p class="ResponsiveP">
  I want to take a moment to express my heartfelt gratitude for considering supporting me. Your willingness to stand by
  my side in this creative journey means the world to me, and I am truly humbled by your generosity.
</p>
<p class="ResponsiveP">
  Your support goes far beyond the financial contributions; it represents belief in my work and a shared passion for
  what I do. Your encouragement inspires me to continue developing.
</p>
<p class="ResponsiveP">
  Your support not only helps me sustain and grow as a developer, but also enables me to dedicate more time and
  resources to producing high-quality mods. It allows me to explore new ideas, enhance my skills, and bring even more
  meaningful and enjoyable content to you.
</p>
<p class="ResponsiveP">Thank you all~</p>
<p class="ResponsiveP">With love, Monikka♥</p>
`;
