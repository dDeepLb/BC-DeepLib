import { Button } from '../../base/elements_typings';
import { BaseSubscreen, getRelativeHeight, getRelativeWidth, getRelativeX, getRelativeY } from '../../deep_lib';

export function elementCreateButton(options: Button) {
  const width = options.size ? getRelativeWidth(options.size[0]) + 'px' : '';
  const height = options.size ? getRelativeHeight(options.size[1]) + 'px' : '';
  const left = options.position ? getRelativeX(options.position[0]) + 'px' : '';
  const top = options.position ? getRelativeY(options.position[1]) + 'px' : '';
  const position = options.position ? 'fixed' : '';

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
        style: {
          width: width,
          height: height,
          left: left,
          top: top,
          position: position,
        }
      },
    }
  );
  
  BaseSubscreen.currentElements.push([button, options]);

  return button;
}
