import { Custom } from '../../base/elements_typings';
import { BaseSubscreen } from '../../deep_lib';

export function elementCreateCustom(options: Custom) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate(options.options);

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}
