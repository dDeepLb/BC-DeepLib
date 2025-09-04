export const layout = {
  createSubscreen: elementCreateSubscreenDiv,
  getSubscreen: elementGetSubscreenDiv,
  appendToSubscreen: elementAppendToSubscreenDiv,
  removeSubscreen: elementRemoveSubscreenDiv,

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

  const div = ElementCreate({
    tag: 'div',
    classList: ['deeplib-subscreen', 'HideOnPopup'],
    attributes: { id: 'deeplib-subscreen' }
  });

  return document.body.appendChild(div);
}

function elementGetSubscreenDiv() {
  return ElementWrap('deeplib-subscreen');
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

  const div = ElementCreate({
    tag: 'div', 
    classList: ['deeplib-settings', 'scroll-box'], 
    attributes: { id: 'deeplib-settings' } 
  });

  return div;
}

function elementGetSettingsDiv() {
  return ElementWrap('deeplib-settings');
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

  const div = ElementCreate({
    tag: 'div', 
    classList: ['deeplib-misc'], 
    attributes: { id: 'deeplib-misc' }
  });

  return div;
}

function elementGetMiscDiv() {
  return ElementWrap('deeplib-misc');
}

function elementAppendToMiscDiv(...element: HTMLElement[]) {
  return elementGetMiscDiv()?.append(...element);
}

function elementRemoveMiscDiv() {
  return elementGetMiscDiv()?.remove();
}
