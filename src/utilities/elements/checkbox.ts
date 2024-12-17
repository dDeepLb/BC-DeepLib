import { Checkbox } from '../../base/elements_typings';
import { BaseSubscreen, elementSetTooltip } from '../../deep_lib';

export function elementCreateCheckbox(options: Checkbox) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-checkbox-container'],
    attributes: {
      id: `${options.id}-container`,
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
          type: 'checkbox',
          id: options.id,
          checked: options.getSettingValue() || undefined,
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
    ]
  });

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
