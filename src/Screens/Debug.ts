
import { Button, SettingElement } from 'Types/elements';
import { BaseSubscreen, deepLibLogger } from '../DeepLib';

export class GuiDebug extends BaseSubscreen {

  get name(): string {
    return 'debug';
  }

  get pageStructure(): SettingElement[][] {
    return [[
      <Button>{
        type: 'button',
        roundness: 50,
        id: 'deeplib-big-button',
        size: [405, 80],
        label: 'Big Button',
        tooltip: 'This is a big button',
        image: 'Icons/Exit.png',
        onClick() {
          deepLibLogger.info('Big Button Clicked');
        }
      },
      <Button>{
        type: 'button',
        roundness: 5,
        id: 'deeplib-small-button',
        size: [90, 90],
        label: 'Small Button',
        tooltip: 'This is a small button',
        image: 'Icons/Exit.png',
        onClick() {
          deepLibLogger.info('Small Button Clicked');
        }
      }
    ]];
  }

  load(): void {
    super.load();
  }

  run() {
    super.run();
  }

  click() { }

  exit(): void {
    super.exit();
  }

  resize(): void {
    super.resize();
  }
}
