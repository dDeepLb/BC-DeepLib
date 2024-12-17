import { Label } from '../../base/elements_typings';
import { BaseSubscreen, elementSetTooltip } from '../../deep_lib';

export function elementCreateLabel(options: Label) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-label-container'],
    attributes: {
      id: `${options.id}-container`,
    },
    children: [
      {
        tag: 'span',
        classList: ['deeplib-label', 'deeplib-text'],
        attributes: {
          id: options.id
        },
        dataAttributes: {
          'size': options.size?.join('x'),
          'position': options.position?.join('x'),
        },
        children: [
          options.label,
        ],
      } 
    ]
    
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
