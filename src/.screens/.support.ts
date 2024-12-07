import { Button, SettingElement } from '../.base/elements_typings';
import { BaseSubscreen, elementSetPosSizeFont, getText } from '../deep_lib';

export class SupportHelper {
  private static thankYouList: string[] = ['Ellena', 'weboos', 'Jamie'];
  private static thankYouNext = 0;
  private static thankYou = '';

  static getSupporter() {
    if (SupportHelper.thankYouNext < CommonTime()) SupportHelper.doNextThankYou();
    return `${getText('support.other.thankyou')}, ${SupportHelper.thankYou}`;
  }

  static doNextThankYou() {
    if (SupportHelper.thankYou && SupportHelper.thankYouList.length < 2) return;
    SupportHelper.thankYou = CommonRandomItemFromList(SupportHelper.thankYou, SupportHelper.thankYouList);
    SupportHelper.thankYouNext = CommonTime() + 5000;
  }
}

export class GuiSupport extends BaseSubscreen {
  get name(): string {
    return 'Support';
  }

  get currentPage(): SettingElement[] {
    return [
      <Button>{
        type: 'button',
        id: 'deeplib-support-kofi',
        size: [405, 80],
        label: getText('support.button.ko-fi'),
        image: 'https://storage.ko-fi.com/cdn/nav-logo-stroke.png',
        onClick() {
          window.open('https://ko-fi.com/monikka_bc', '_blank');
        }
      },
      <Button>{
        type: 'button',
        id: 'deeplib-support-patreon',
        size: [405, 80],
        label: getText('support.button.patreon'),
        image: 'https://c5.patreon.com/external/favicon/rebrand/favicon-32.png?v=af5597c2ef',
        onClick() {
          window.open('https://patreon.com/monikka_bc', '_blank');
        }
      }
    ];
  }

  load() {
    SupportHelper.doNextThankYou();
    super.load();
    ElementRemove('deeplib-settngs');

    ElementCreateDiv('deeplib-gratitude');
    const elm = document.getElementById('deeplib-gratitude') as HTMLElement;
    ElementContent('deeplib-gratitude', gratitudeHtml);
    elementSetPosSizeFont({ element: elm }, 1000, 250, 400, 400);

  }

  run() {
    super.run();
  }

  click() {
    super.click();
  }

  exit() {
    ElementRemove('deeplib-gratitude');
    super.exit();
  }

  resize(): void {
    super.resize();
    elementSetPosSizeFont({ elementId: 'deeplib-gratitude' }, 1000, 250, 400, 400);
  }
}

const gratitudeHtml = /*html*/ `
<h1>Dear Supporters!</h1>
<p>
  I want to take a moment to express my heartfelt gratitude for considering supporting me. Your willingness to stand by
  my side in this creative journey means the world to me, and I am truly humbled by your generosity.
</p>
<p>
  Your support goes far beyond the financial contributions; it represents belief in my work and a shared passion for
  what I do. Your encouragement inspires me to continue developing.
</p>
<p>
  Your support not only helps me sustain and grow as a developer, but also enables me to dedicate more time and
  resources to producing high-quality mods. It allows me to explore new ideas, enhance my skills, and bring even more
  meaningful and enjoyable content to you.
</p>
<p>Thank you all~</p>
<p>With love, Monikka♥</p>
`;
