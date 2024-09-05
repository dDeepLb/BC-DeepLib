import { Input, Label } from 'Types/elements';
import { BaseSubscreen } from '../../DeepLib';
import { elementCreateTooltip } from './Tooltip';

export function elementCreateInput(options: Input) {
  const input = document.createElement('input');
  input.id = options.id;
  input.type = options.type;
  input.classList.add('deeplib-input');
  input.setAttribute('autocomplete', 'off');
  input.value = options.setElementValue() ?? '';

  BaseSubscreen.currentElements.push([input, options]);
  return input;
}

export function elementCreateLabel(options: Label) {
  const labelContainer = document.createElement('div');
  labelContainer.classList.add('deeplib-label-container');

  const label = document.createElement('span');
  label.id = options.id;
  label.classList.add('deeplib-label');
  label.textContent = options.label;
  labelContainer.append(label);

  if (options.description) {
    labelContainer.append(elementCreateTooltip(label, options.description));
  }

  BaseSubscreen.currentElements.push([label, options]);
  return labelContainer;
}
