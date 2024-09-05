import { elementSetPosSizeFont } from '../../DeepLib';

export function elementCreateSubscreenDiv() {
  const subscreenDiv = elementGetSubscreenDiv();
  if (subscreenDiv) {
    console.error('Subscreen already exists');
    return subscreenDiv;
  }

  const div = document.createElement('div');
  div.id = 'deeplib-subscreen';
  div.classList.add('deeplib-subscreen', 'HideOnPopup');

  elementSetPosSizeFont({ element: div }, 0, 0, 2000, 1000);

  return document.body.appendChild(div);
}

export function elementGetSubscreenDiv() {
  return document.getElementById('deeplib-subscreen') ?? undefined;
}

export function elementRemoveSubscreenDiv() {
  return elementGetSubscreenDiv()?.remove();
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

  elementSetPosSizeFont({ element: div }, 530, 170, 800, 735);

  return div;
}

export function elementGetSettingsDiv() {
  return document.getElementById('deeplib-settings') ?? undefined;
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

