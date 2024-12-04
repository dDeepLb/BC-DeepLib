import { Button } from 'Types/elements';
import { BaseSubscreen, getRelativeHeight, getRelativeWidth, getRelativeX, getRelativeY } from '../../DeepLib';

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
              alt: options.label,
              disabled: options.disabled,
              decoding: 'async', 
              loading: 'lazy'
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