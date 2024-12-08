import { Input } from '../../base/elements_typings';
import { BaseSubscreen, elementSetTooltip } from '../../deep_lib';

export function elementCreateInput(options: Input) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-input-container'],
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
