import { deepLibLogger } from '../../DeepLib';

export function elementSetPosition(_: { elementId?: string; element?: HTMLElement; }, xPos: number, yPos: number) {
  if (!_)
    return deepLibLogger.warn('elementSetPosition called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn('A call to elementSetPosition was made on non-existent element');

  const HRatio = MainCanvas.canvas.clientHeight / 1000;
  const WRatio = MainCanvas.canvas.clientWidth / 2000;
  const Top = MainCanvas.canvas.offsetTop + yPos * HRatio;
  const Left = MainCanvas.canvas.offsetLeft + xPos * WRatio;

  Object.assign(element.style, {
    position: 'fixed',
    left: Left + 'px',
    top: Top + 'px'
  });
}

export function elementSetSize(_: { elementId?: string; element?: HTMLElement; }, width: number, height: number) {
  if (!_)
    return deepLibLogger.warn('elementSetSize called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn('A call to elementSetSize was made on non-existent element');

  const HRatio = MainCanvas.canvas.clientHeight / 1000;
  const WRatio = MainCanvas.canvas.clientWidth / 2000;
  const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;
  const Height = height ? height * HRatio : Font * 1.15;
  const Width = width * WRatio;

  Object.assign(element.style, {
    width: Width + 'px',
    height: Height + 'px',
  });
}

export function elementAdjustFontSize(_: { elementId?: string; element?: HTMLElement; }) {
  if (!_)
    return deepLibLogger.warn('elementSetSize called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn('A call to elementSetSize was made on non-existent element');

  const Font = MainCanvas.canvas.clientWidth <= MainCanvas.canvas.clientHeight * 2 ? MainCanvas.canvas.clientWidth / 50 : MainCanvas.canvas.clientHeight / 25;

  Object.assign(element.style, {
    fontSize: Font + 'px',
    fontFamily: CommonGetFontName()
  });
}

export function elementSetPosSizeFont(_: { elementId?: string; element?: HTMLElement; }, xPos: number, yPos: number, width: number, height: number) {
  if (!_)
    return deepLibLogger.warn('elementSetPosSizeFont called without an elementId or element');

  elementSetPosition(_, xPos, yPos);
  elementSetSize(_, width, height);
  elementAdjustFontSize(_);
}

export function elementHide(_: { elementId?: string; element?: HTMLElement; }) {
  if (!_)
    return deepLibLogger.warn('elementHide called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn('A call to elementHide was made on non-existent element');

  element.style.display = 'none';
}

export function elementUnhide(_: { elementId?: string; element?: HTMLElement; }) {
  if (!_)
    return deepLibLogger.warn('elementUnhide called without an elementId or element');

  const element = _.element ?? document.getElementById(_.elementId!);

  if (!element)
    return deepLibLogger.warn('A call to elementUnhide was made on non-existent element');

  element.style.display = '';
}
