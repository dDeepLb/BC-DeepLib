import { Button } from '../../base/elements_typings';
import { BaseSubscreen } from '../../deep_lib';

export function elementCreateButton(options: Button) {
  const button = ElementButton.Create(options.id, () => options.onClick(),
    {
      tooltip: options.tooltip,
      label: options.label,
      labelPosition: 'center',
    },
    {
      button: {
        classList: ['deeplib-button'],
        children: [
          {
            tag: 'img',
            attributes: {
              id: `${options.id}-image`,
              alt: '',
              disabled: options.disabled,
              decoding: 'async', 
              loading: 'lazy',
              src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // 1x1 transparent image to get rid of broken image
            },
            dataAttributes: {
              'size': options.size?.join('x'),
              'position': options.position?.join('x'),
            },
            style: {
              '--image': `url("${options.image}")`,
            }
          },
        ],
      },
    }
  );

  const buttonContainer = ElementCreate({
    tag: 'div',
    classList: ['deeplib-button-container'],
    attributes: {
      id: `${options.id}-container`,
    },
    children: [button],
  });
  
  BaseSubscreen.currentElements.push([buttonContainer, options]);

  return buttonContainer;
}
