import { Button, Checkbox, Input, Label } from '../../../.types/elements';
import { BaseSubscreen } from '../../DeepLib';
import { DeeplibButton } from './ButtonElement';

export function elementCreateButton(options: Button) {
  return new DeeplibButton(options);
}

export function elementCreateCheckbox(options: Checkbox) {
  const checkbox = document.createElement('input');
  checkbox.id = options.id;
  checkbox.type = 'checkbox';
  checkbox.classList.add('deeplib-checkbox');

  BaseSubscreen.currentElements.push([checkbox, options]);
  return checkbox;
}

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
    const hoverHint = document.createElement('span');
    hoverHint.classList.add('deeplib-hoverhint');
    hoverHint.textContent = options.description;
    hoverHint.style.display = 'none';

    label.addEventListener('onmouseover', () => {
      hoverHint.style.display = 'block';
    });

    label.addEventListener('onmouseleave', () => {
      hoverHint.style.display = 'none';
    });

    labelContainer.append(hoverHint);
  }

  BaseSubscreen.currentElements.push([label, options]);
  return labelContainer;
}
