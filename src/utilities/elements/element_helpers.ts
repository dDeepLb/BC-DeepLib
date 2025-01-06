import { deepLibLogger } from '../../deep_lib';

type ElementOrId = { elementId?: string; element?: HTMLElement; };

const mainCanvasHeight = 1000;
const mainCanvasWidth = 2000;

function getRelativeHeight(height: number) {
  return height * (MainCanvas.canvas.clientHeight / mainCanvasHeight);
}

function getRelativeWidth(width: number) {
  return width * (MainCanvas.canvas.clientWidth / mainCanvasWidth);
}

function getRelativeY(yPos: number, anchorPosition: 'top' | 'bottom' = 'top') {
  const scaleY = MainCanvas.canvas.clientHeight / mainCanvasHeight;
  return anchorPosition === 'top'
    ? MainCanvas.canvas.offsetTop + yPos * scaleY
    : MainCanvas.canvas.offsetTop + MainCanvas.canvas.clientHeight - yPos * scaleY;
}

function getRelativeX(xPos: number, anchorPosition: 'left' | 'right' = 'left') {
  const scaleX = MainCanvas.canvas.clientWidth / mainCanvasWidth;
  return anchorPosition === 'left'
    ? MainCanvas.canvas.offsetLeft + xPos * scaleX
    : MainCanvas.canvas.offsetLeft + MainCanvas.canvas.clientWidth - xPos * scaleX;
}

export const domUtil = {
  setPosition: setPosition,
  setSize: setSize,
  setFontSize: setFontSize,
  autosetFontSize: autosetFontSize,
  hide: hide,
  unhide: unhide,
  get: get
};

function setPosition(_: ElementOrId, xPos: number, yPos: number, anchorPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-left') {
  const element = get(_, setPosition.name);
  if (!element) return;

  const yAnchor = anchorPosition === 'top-left' || anchorPosition === 'top-right' ? 'top' : 'bottom';
  const xAnchor = anchorPosition === 'top-left' || anchorPosition === 'bottom-left' ? 'left' : 'right';

  const y = getRelativeY(yPos, yAnchor);
  const x = getRelativeX(xPos, xAnchor);

  Object.assign(element.style, {
    position: 'fixed',
    [xAnchor]: x + 'px',
    [yAnchor]: y + 'px',
  });


};

function setSize(_: ElementOrId, width: number | null, height: number | null) {
  const element = get(_, setSize.name);
  if (!element) return;

  if (width !== null) {
    const Width = getRelativeWidth(width);
    Object.assign(element.style, {
      width: Width + 'px',
    });
  }

  if (height !== null) {
    const Height = getRelativeHeight(height);
    Object.assign(element.style, {
      height: Height + 'px',
    });
  }
};

function setFontSize(_: ElementOrId, targetFontSize: number) {
  const element = get(_, setFontSize.name);
  if (!element) return;

  const canvasWidth = MainCanvas.canvas.clientWidth;
  const canvasHeight = MainCanvas.canvas.clientHeight;

  const scaleFactor = Math.min(canvasWidth, canvasHeight) / 100;

  const fontSize = targetFontSize * scaleFactor;

  Object.assign(element.style, {
    fontSize: fontSize + 'px',
    fontFamily: CommonGetFontName()
  });
};

function autosetFontSize(_: ElementOrId) {
  const element = get(_, autosetFontSize.name);
  if (!element) return;

  const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;

  Object.assign(element.style, {
    fontSize: Font + 'px',
    fontFamily: CommonGetFontName()
  });
};

function hide(_: ElementOrId) {
  const element = get(_, hide.name);
  if (!element) return;

  element.style.display = 'none';
};

function unhide(_: ElementOrId) {
  const element = get(_, unhide.name);
  if (!element) return;

  element.style.display = '';
};

function get(_: ElementOrId, funcName: string) {
  if (!_) {
    deepLibLogger.warn(`${funcName} called without an elementId or element`);
    return null;
  }

  const elementId = _.elementId ?? _.element?.id;
  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element) {
    deepLibLogger.warn(`A call to ${funcName} was made on non-existent element with id ${elementId}`);
    return null;
  }

  return element;
}
