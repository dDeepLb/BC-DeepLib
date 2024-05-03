import { Button, Checkbox, Input, Label } from '../../.types/elements';
import { SETTING_NAME_PREFIX } from '../Base/SettingDefinitions';
import { deepLibLogger } from './Logger';

const divId = `${SETTING_NAME_PREFIX}Subscreen`;

export function elementCreateSubscreenDiv() {
  const subscreenDiv = elementGetSubscreenDiv();
  if (subscreenDiv) {
    console.error('Subscreen already exists');
    return subscreenDiv;
  }

  const div = document.createElement('div');
  div.id = divId;
  div.classList.add('deeplib-subscreen');

  return document.body.appendChild(div);
}

export function elementRemoveSubscreenDiv() {
  return elementGetSubscreenDiv()?.remove();
}

export function elementGetSubscreenDiv() {
  return document.getElementById(divId);
}

export function elementAppendToSubscreenDiv(element: HTMLElement) {
  return elementGetSubscreenDiv()?.appendChild(element);
}

export function elementCreateSettingsDiv() {
  const settingsDiv = elementGetSettingsDiv();
  if (settingsDiv) {
    console.error('Settings screen already exists');
    return settingsDiv;
  }

  const div = document.createElement('div');
  div.id = 'deeplib-settings';
  div.classList.add('deeplib-settings');
  div.style.position = 'fixed';
  div.style.zIndex = '1001';

  return div;
}

export function elementGetSettingsDiv() {
  return document.getElementById('deeplib-settings');
}

export function elementAppendToSettingsDiv(element: HTMLElement) {
  return elementGetSettingsDiv()?.appendChild(element);
}

export function elementCreateMiscDiv() {
  const miscDiv = elementGetMiscDiv();
  if (miscDiv) {
    console.error('Settings screen already exists');
    return miscDiv;
  }

  const div = document.createElement('div');
  div.id = 'deeplib-misc';
  div.classList.add('deeplib-misc');

  return div;
}

export function elementGetMiscDiv() {
  return document.getElementById('deeplib-misc');
}

export function elementAppendToMiscDiv(element: HTMLElement) {
  return elementGetMiscDiv()?.appendChild(element);
}

export function elementSetPosition(_: { elementId?: string, element?: HTMLElement; }, xPos: number, yPos: number) {
  if (!_)
    return deepLibLogger.warn('elementSetPosition called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn("A call to elementSetPosition was made on non-existent element");

  const HRatio = MainCanvas.canvas.clientHeight / 1000;
  const WRatio = MainCanvas.canvas.clientWidth / 2000;
  const Top = MainCanvas.canvas.offsetTop + yPos * HRatio;
  const Left = MainCanvas.canvas.offsetLeft + xPos * WRatio;

  Object.assign(element.style, {
    position: "fixed",
    left: Left + "px",
    top: Top + "px",
    display: "inline"
  });
}

export function elementSetSize(_: { elementId?: string, element?: HTMLElement; }, width: number, height: number) {
  if (!_)
    return deepLibLogger.warn('elementSetSize called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn("A call to elementSetSize was made on non-existent element");

  const HRatio = MainCanvas.canvas.clientHeight / 1000;
  const WRatio = MainCanvas.canvas.clientWidth / 2000;
  const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;
  const Height = height ? height * HRatio : Font * 1.15;
  const Width = width * WRatio;

  Object.assign(element.style, {
    width: Width + "px",
    height: Height + "px",
  });
}

export function elementAdjustFontSize(_: { elementId?: string, element?: HTMLElement; }) {
  if (!_)
    return deepLibLogger.warn('elementSetSize called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn("A call to elementSetSize was made on non-existent element");

  const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;

  Object.assign(element.style, {
    fontSize: Font + "px",
    fontFamily: CommonGetFontName()
  });
}

export function elementSetPosSizeFont(_: { elementId?: string, element?: HTMLElement; }, xPos: number, yPos: number, width: number, height: number) {
  elementSetPosition(_, xPos, yPos);
  elementSetSize(_, width, height);
  elementAdjustFontSize(_);
}

export function elementCreateButton(options: Button) {
  const button = document.createElement('button');
  button.classList.add('deeplib-button');

  if (options.image) {
    const img = document.createElement('img');
    img.src = options.image;
    button.appendChild(img);
  }

  if (options.label) {
    const label = document.createElement('span');
    label.innerText = options.label;
    button.appendChild(label);
  }

  button.addEventListener('click', options.onClick);

  return button;
}

export function elementCreateCheckbox(options: Checkbox) {
  const checkbox = document.createElement('input');
  checkbox.id = options.id;
  checkbox.type = 'checkbox';
  checkbox.classList.add('deeplib-checkbox');

  return checkbox;
}

export function elementCreateInput(options: Input) {
  const input = document.createElement('input');
  input.id = options.id;
  input.type = options.type;
  input.classList.add('deeplib-input');
  input.setAttribute('autocomplete', 'off');
  input.value = options.setElementValue() ?? '';

  return input;
}

export function elementCreateLabel(options: Label) {
  const labelContainer = document.createElement('div');
  labelContainer.classList.add('deeplib-label-container');

  const label = document.createElement('span');
  label.id = options.id;
  label.classList.add('deeplib-label');
  label.textContent = options.label;

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

  labelContainer.append(label, hoverHint);

  return labelContainer;
}
