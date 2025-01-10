export const layoutElement = {
  createSubscreenDiv: elementCreateSubscreenDiv,
  getSubscreenDiv: elementGetSubscreenDiv,
  appendToSubscreenDiv: elementAppendToSubscreenDiv,
  removeSubscreenDiv: elementRemoveSubscreenDiv,

  createSettingsDiv: elementCreateSettingsDiv,
  getSettingsDiv: elementGetSettingsDiv,
  appendToSettingsDiv: elementAppendToSettingsDiv,
  removeSettingsDiv: elementRemoveSettingsDiv,

  createMiscDiv: elementCreateMiscDiv,
  getMiscDiv: elementGetMiscDiv,
  appendToMiscDiv: elementAppendToMiscDiv,
  removeMiscDiv: elementRemoveMiscDiv
};

function elementCreateSubscreenDiv() {
  const subscreenDiv = elementGetSubscreenDiv();
  if (subscreenDiv) {
    console.error('Subscreen already exists');
    return subscreenDiv;
  }

  const div = document.createElement('div');
  div.id = 'deeplib-subscreen';
  div.classList.add('deeplib-subscreen', 'HideOnPopup');

  return document.body.appendChild(div);
}

function elementGetSubscreenDiv() {
  return document.getElementById('deeplib-subscreen') ?? undefined;
}

function elementRemoveSubscreenDiv() {
  return elementGetSubscreenDiv()?.remove();
}

function elementAppendToSubscreenDiv(...element: HTMLElement[]) {
  return elementGetSubscreenDiv()?.append(...element);
}

function elementCreateSettingsDiv() {
  const settingsDiv = elementGetSettingsDiv();
  if (settingsDiv) {
    console.error('Settings screen already exists');
    return settingsDiv;
  }

  const div = document.createElement('div');
  div.id = 'deeplib-settings';
  div.classList.add('deeplib-settings');

  return div;
}

function elementGetSettingsDiv() {
  return document.getElementById('deeplib-settings') ?? undefined;
}

function elementAppendToSettingsDiv(...element: HTMLElement[]) {
  return elementGetSettingsDiv()?.append(...element);
}

function elementRemoveSettingsDiv() {
  return elementGetSettingsDiv()?.remove();
}

function elementCreateMiscDiv() {
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

function elementGetMiscDiv() {
  return document.getElementById('deeplib-misc');
}

function elementAppendToMiscDiv(...element: HTMLElement[]) {
  return elementGetMiscDiv()?.append(...element);
}

function elementRemoveMiscDiv() {
  return elementGetMiscDiv()?.remove();
}
