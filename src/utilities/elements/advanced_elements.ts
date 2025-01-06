import { Button, Checkbox, Custom, Input, Label } from '../../base/elements_typings';
import { BaseSubscreen } from '../../deep_lib';

export const advancedElement = {
  createButton: elementCreateButton,
  createCheckbox: elementCreateCheckbox,
  createInput: elementCreateInput,
  createLabel: elementCreateLabel,
  createCustom: elementCreateCustom,

  createTooltip: elementCreateTooltip,
  getTooltip: elementGetTooltip,
  setTooltip: elementSetTooltip,
};

function elementCreateButton(options: Button) {
  const button = ElementButton.Create(
    options.customOptions?.id ?? options.id,
    options.customOptions?.onClick ?? options?.onClick ?? (() => { }),
    {
      ...options.customOptions?.options,
      tooltip: options.tooltip,
      label: options.label,
      labelPosition: 'center',
    },
    {
      ...options.customOptions?.htmlOptions,
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
};

function elementCreateCheckbox(options: Checkbox) {
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
          checked: options?.getSettingValue?.() || undefined,
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
    ],
    ...options.customOptions
  });

  if (options.description) {
    retElem.addEventListener('mouseover', () => {
      elementSetTooltip(options.description || '');
    });

    retElem.addEventListener('mouseout', () => {
      elementSetTooltip('');
    });
  }

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}

function elementCreateCustom(options: Custom) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate(options.options);

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}

function elementCreateInput(options: Input) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-input-container'],
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
    ],
    ...options.customOptions
  });

  if (options.getElementValue?.()) {
    const input = document.getElementById(options.id) as HTMLInputElement;
    if (input) input.value = options.getElementValue();
  }

  if (options.description) {
    retElem.addEventListener('mouseover', () => {
      elementSetTooltip(options.description || '');
    });

    retElem.addEventListener('mouseout', () => {
      elementSetTooltip('');
    });
  }

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}

function elementCreateLabel(options: Label) {
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
    ],
    ...options.customOptions
  });

  if (options.description) {
    retElem.addEventListener('mouseover', () => {
      elementSetTooltip(options.description || '');
    });

    retElem.addEventListener('mouseout', () => {
      elementSetTooltip('');
    });
  }

  BaseSubscreen.currentElements.push([retElem, options]);

  return retElem;
}

function elementCreateTooltip() {
  const element = ElementCreate({
    tag: 'div',
    classList: ['deeplib-tooltip'],
    attributes: {
      id: 'deeplib-tooltip'
    },
    style: {
      display: 'none'
    }
  });

  return element;
}


function elementGetTooltip() {
  return document.getElementById('deeplib-tooltip') ?? undefined;
}


function elementSetTooltip(text: string) {
  const element = document.getElementById('deeplib-tooltip');

  if (!element) return false;

  element.innerHTML = text;
  if (text === '') element.style.display = 'none';
  else element.style.display = '';

  return true;
}

