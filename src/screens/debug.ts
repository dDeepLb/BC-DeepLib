
import { Button, Checkbox, Input, Label, SettingElement } from '../base/elements_typings';
import { BaseSubscreen, deepLibLogger, SubscreenOptions } from '../deeplib';

export class GuiDebug extends BaseSubscreen {

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'debug',
  };

  get pageStructure(): SettingElement[][] {
    return [[
      <Button>{
        type: 'button',
        id: 'test-deeplib-big-button',
        options: {
          label: 'Big Button',
          tooltip: 'This is a big button',
          image: 'Icons/Exit.png',
        },
        size: [405, 80],
        onClick() {
          deepLibLogger.info('Big Button Clicked');
        }
      },
      <Button>{
        type: 'button',
        id: 'test-deeplib-small-button',
        options: {
          tooltip: 'This is a small button',
          image: 'Icons/Exit.png',
        },
        size: [90, 90],
        onClick() {
          deepLibLogger.info('Small Button Clicked');
        }
      },
      <Checkbox>{
        type: 'checkbox',
        id: 'test-deeplib-checkbox',
        label: 'Checkbox',
        description: 'This is a checkbox',
        setElementValue() {
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
        setElementValue() {
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
        setElementValue() {
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
    ],
    [
      <Button>{
        type: 'button',
        id: 'test-deeplib-big-button2',
        options: {
          label: 'Big Button',
          tooltip: 'This is a big button',
          image: 'Icons/Exit.png',
        },
        size: [405, 80],
        onClick() {
          deepLibLogger.info('Big Button Clicked');
        }
      },
      <Button>{
        type: 'button',
        id: 'test-deeplib-small-button2',
        options: {
          tooltip: 'This is a small button',
          image: 'Icons/Next.png',
        },
        size: [90, 90],
        onClick() {
          deepLibLogger.info('Small Button Clicked');
        }
      },
      <Checkbox>{
        type: 'checkbox',
        id: 'test-deeplib-checkbox2',
        label: 'Checkbox',
        description: 'This is a checkbox',
        setElementValue() {
          return true;
        },
        setSettingValue(val: boolean) {
          deepLibLogger.info('Checkbox value:', val);
        },
      },
      <Input>{
        type: 'text',
        id: 'test-deeplib-text-input2',
        label: 'Input',
        description: 'This is a text input',
        setElementValue() {
          return 'Input Value';
        },
        setSettingValue(val: string) {
          deepLibLogger.info('Input value:', val);
        },
      },
      <Input>{
        type: 'number',
        id: 'test-deeplib-number-input2',
        label: 'Input',
        description: 'This is a number input',
        setElementValue() {
          return '123';
        },
        setSettingValue(val: string) {
          deepLibLogger.info('Input value:', val);
        },
      },
      <Label>{
        type: 'label',
        id: 'test-deeplib-label2',
        label: 'Label',
        description: 'This is a label',
      }
    ]];
  }
}
