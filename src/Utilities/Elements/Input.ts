import { Input } from '../../base/elements_typings';
import { BaseSubscreen, elementSetTooltip, getRelativeHeight, getRelativeWidth, getRelativeX, getRelativeY } from '../../deep_lib';

export function elementCreateInput(options: Input) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const width = options.size ? getRelativeWidth(options.size[0]) + 'px' : '';
  const height = options.size ? getRelativeHeight(options.size[1]) + 'px' : '';
  const left = options.position ? getRelativeX(options.position[0]) + 'px' : '';
  const top = options.position ? getRelativeY(options.position[1]) + 'px' : '';
  const position = options.position ? 'fixed' : '';

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-input-container'],
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
      {
        tag: 'input',
        classList: ['deeplib-input'],
        attributes: {
          type: options.type,
          id: options.id,
          placeholder: ' ',
        },
      },
      {
        tag: 'label',
        classList: ['deeplib-text'],
        attributes: {
          for: options.id,
        },
        children: [options.label]
      },
      {
        tag: 'div',
        classList: ['deeplib-underline'],
      }
    ]
  });

  if (options.getElementValue?.()) {
    const input = document.getElementById(options.id) as HTMLInputElement;
    if (input) input.value = options.getElementValue();
  }
  
  if (options.description) {
    retElem.addEventListener('mouseover', () => {
      elementSetTooltip(options.description);
    });

    retElem.addEventListener('mouseout', () => {
      elementSetTooltip('');
    });
  }

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}
