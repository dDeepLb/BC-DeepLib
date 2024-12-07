import { Label } from '../../base/elements_typings';
import { BaseSubscreen, elementSetTooltip, getRelativeHeight, getRelativeWidth, getRelativeX, getRelativeY } from '../../deep_lib';

export function elementCreateLabel(options: Label) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const width = options.size ? getRelativeWidth(options.size[0]) + 'px' : '';
  const height = options.size ? getRelativeHeight(options.size[1]) + 'px' : '';
  const left = options.position ? getRelativeX(options.position[0]) + 'px' : '';
  const top = options.position ? getRelativeY(options.position[1]) + 'px' : '';
  const position = options.position ? 'fixed' : '';

  const retElem = ElementCreate({
    tag: 'span',
    classList: ['deeplib-label', 'deeplib-text'],
    attributes: {
      id: options.id
    },
    style: {
      width: width,
      height: height,
      left: left,
      top: top,
      position: position,
    },
    dataAttributes: {
      'size': options.size?.join('x'),
      'position': options.position?.join('x'),
    },
    children: [
      options.label,
    ],
  });
  
  if (options.description) {
    retElem.addEventListener('mouseover', () => {
      elementSetTooltip(options.description as string);
    });

    retElem.addEventListener('mouseout', () => {
      elementSetTooltip('');
    });
  }

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}
