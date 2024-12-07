
import { Button, Checkbox, Input, Label, SettingElement } from '../.base/elements_typings';
import { BaseSubscreen, deepLibLogger } from '../deep_lib';

export class GuiDebug extends BaseSubscreen {

  get name(): string {
    return 'debug';
  }

  get pageStructure(): SettingElement[][] {
    return [[
      <Button>{
        type: 'button',
        roundness: 50,
        id: 'test-deeplib-big-button',
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
        id: 'test-deeplib-small-button',
        size: [90, 90],
        tooltip: 'This is a small button',
        image: 'Icons/Exit.png',
        onClick() {
          deepLibLogger.info('Small Button Clicked');
        }
      },
      <Checkbox>{
        type: 'checkbox',
        id: 'test-deeplib-checkbox',
        label: 'Checkbox',
        description: 'This is a checkbox',
        checked: false,
        getSettingValue() {
          return true;
        },
        setSettingValue(val: boolean) {
          deepLibLogger.info('Checkbox value:', val);
        },
      },
      <Input>{
        type: 'text',
        id: 'test-deeplib-text-input',
        label: 'Input',
        description: 'This is a text input',
        getElementValue() {
          return 'Input Value';
        },
        setSettingValue(val: string) {
          deepLibLogger.info('Input value:', val);
        },
      },
      <Input>{
        type: 'number',
        id: 'test-deeplib-number-input',
        label: 'Input',
        description: 'This is a number input',
        getElementValue() {
          return '123';
        },
        setSettingValue(val: string) {
          deepLibLogger.info('Input value:', val);
        },
      },
      <Label>{
        type: 'label',
        id: 'test-deeplib-label',
        label: 'Label',
        description: 'This is a label',
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
