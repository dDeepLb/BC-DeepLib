import { deepLibLogger } from '../../deep_lib';

type ElementOrId = { elementId?: string; element?: HTMLElement; };

const mainCanvasHeight = 1000;
const mainCanvasWidth = 2000;

export function getRelativeHeight(height: number) {
  return height * (MainCanvas.canvas.clientHeight / mainCanvasHeight);
}

export function getRelativeWidth(width: number) {
  return width * (MainCanvas.canvas.clientWidth / mainCanvasWidth);
}

export function getRelativeY(yPos: number) {
  return MainCanvas.canvas.offsetTop + yPos * (MainCanvas.canvas.clientHeight / mainCanvasHeight);
}

export function getRelativeX(xPos: number) {
  return MainCanvas.canvas.offsetLeft + xPos * (MainCanvas.canvas.clientWidth / mainCanvasWidth);
}

export function elementSetPosition(_: ElementOrId, xPos: number, yPos: number) {
  const element = elementGet(_, 'elementSetPosition');
  if (!element) return;

  const Top = getRelativeY(yPos);
  const Left = getRelativeX(xPos);

  Object.assign(element.style, {
    position: 'fixed',
    left: Left + 'px',
    top: Top + 'px'
  });
}

export function elementSetSize(_: ElementOrId, width: number, height: number) {
  const element = elementGet(_, 'elementSetSize');
  if (!element) return;

  const Height = getRelativeHeight(height);
  const Width = getRelativeWidth(width);

  Object.assign(element.style, {
    width: Width + 'px',
    height: Height + 'px',
  });
}

export function elementAdjustFontSize(_: ElementOrId) {
  const element = elementGet(_, 'elementAdjustFontSize');
  if (!element) return;

  const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;

  Object.assign(element.style, {
    fontSize: Font + 'px',
    fontFamily: CommonGetFontName()
  });
}

export function elementSetPosSizeFont(_: ElementOrId, xPos: number, yPos: number, width: number, height: number) {
  if (elementGet(_, 'elementSetPosSizeFont') === null) return;

  elementSetPosition(_, xPos, yPos);
  elementSetSize(_, width, height);
  elementAdjustFontSize(_);
}

export function elementHide(_: ElementOrId) {
  const element = elementGet(_, 'elementHide');
  if (!element) return;

  element.style.display = 'none';
}

export function elementUnhide(_: ElementOrId) {
  const element = elementGet(_, 'elementUnhide');
  if (!element) return;

  element.style.display = '';
}

export function elementGet(_: ElementOrId, funcName: string) {
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
