import { SettingElement } from '../../base/elements_typings';

export const domUtil = {
  autoSetPosition: autoSetPosition,
  autoSetSize: autoSetSize,
  hide: hide,
  unhide: unhide,
};

function autoSetPosition(_: ElementHelp.ElementOrId, position: SettingElement['position']) {
  let xPos = undefined;
  let yPos = undefined;

  if (Array.isArray(position)) {
    xPos = position[0];
    yPos = position[1];
  } else if (typeof position === 'function') {
    const result = position();
    xPos = result[0];
    yPos = result[1];
  }

  if (xPos !== undefined && yPos !== undefined) ElementSetPosition(_, xPos, yPos);
}

function autoSetSize(_: ElementHelp.ElementOrId, size: SettingElement['size']) {
  let width = undefined;
  let height = undefined;
  
  if (Array.isArray(size)) {
    width = size[0];
    height = size[1];
  } else if (typeof size === 'function') {
    const result = size();
    width = result[0];
    height = result[1];
  }
        
  if (width !== undefined && height !== undefined) ElementSetSize(_, width, height);
}

function hide(_: ElementHelp.ElementOrId) {
  const element = ElementWrap(_);
  if (!element) return;

  element.style.display = 'none';
};

function unhide(_: ElementHelp.ElementOrId) {
  const element = ElementWrap(_);
  if (!element) return;

  element.style.display = '';
};

