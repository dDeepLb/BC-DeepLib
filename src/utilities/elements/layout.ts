export const layout = {
  getSubscreen: elementGetSubscreenDiv,
  appendToSubscreen: elementAppendToSubscreenDiv,
  removeSubscreen: elementRemoveSubscreenDiv,

  getSettingsDiv: elementGetSettingsDiv,
  appendToSettingsDiv: elementAppendToSettingsDiv,
  removeSettingsDiv: elementRemoveSettingsDiv,

  getMiscDiv: elementGetMiscDiv,
  appendToMiscDiv: elementAppendToMiscDiv,
  removeMiscDiv: elementRemoveMiscDiv
};

function elementGetSubscreenDiv() {
  const subscreenDiv = ElementWrap('deeplib-subscreen');
  if (subscreenDiv) {
    return subscreenDiv;
  }

  const div = ElementCreate({
    tag: 'div',
    classList: ['deeplib-subscreen', 'HideOnPopup'],
    attributes: { id: 'deeplib-subscreen' }
  });

  return document.body.appendChild(div);
}

function elementRemoveSubscreenDiv() {
  return elementGetSubscreenDiv()?.remove();
}

function elementAppendToSubscreenDiv(...element: HTMLElement[]) {
  return elementGetSubscreenDiv()?.append(...element);
}

function elementGetSettingsDiv() {
  const settingsDiv = ElementWrap('deeplib-settings');
  if (settingsDiv) {
    return settingsDiv;
  }

  const div = ElementCreate({
    tag: 'div', 
    classList: ['deeplib-settings', 'scroll-box'], 
    attributes: { id: 'deeplib-settings' } 
  });

  return div;
}

function elementAppendToSettingsDiv(...element: HTMLElement[]) {
  return elementGetSettingsDiv()?.append(...element);
}

function elementRemoveSettingsDiv() {
  return elementGetSettingsDiv()?.remove();
}

function elementGetMiscDiv() {
  const miscDiv = ElementWrap('deeplib-misc');
  if (miscDiv) {
    return miscDiv;
  }

  const div = ElementCreate({
    tag: 'div', 
    classList: ['deeplib-misc'], 
    attributes: { id: 'deeplib-misc' }
  });

  return div;
}

function elementAppendToMiscDiv(...element: HTMLElement[]) {
  return elementGetMiscDiv()?.append(...element);
}

function elementRemoveMiscDiv() {
  return elementGetMiscDiv()?.remove();
}
