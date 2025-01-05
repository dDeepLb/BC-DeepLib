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

export function getRelativeY(yPos: number, anchorPosition: 'top' | 'bottom' = 'top') {
  const scaleY = MainCanvas.canvas.clientHeight / mainCanvasHeight;
  return anchorPosition === 'top'
    ? MainCanvas.canvas.offsetTop + yPos * scaleY
    : MainCanvas.canvas.offsetTop + MainCanvas.canvas.clientHeight - yPos * scaleY;
}

export function getRelativeX(xPos: number, anchorPosition: 'left' | 'right' = 'left') {
  const scaleX = MainCanvas.canvas.clientWidth / mainCanvasWidth;
  return anchorPosition === 'left'
    ? MainCanvas.canvas.offsetLeft + xPos * scaleX
    : MainCanvas.canvas.offsetLeft + MainCanvas.canvas.clientWidth - xPos * scaleX;
}

export function elementSetPosition(_: ElementOrId, xPos: number, yPos: number, anchorPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-left') {
  const element = elementGet(_, 'elementSetPosition');
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
}

export function elementSetSize(_: ElementOrId, width: number | null, height: number | null) {
  const element = elementGet(_, 'elementSetSize');
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
