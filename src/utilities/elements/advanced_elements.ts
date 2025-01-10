import { Button, Checkbox, Custom, Input, Label } from '../../base/elements_typings';
import { BaseSubscreen } from '../../deep_lib';
import { deepMerge } from '../common';

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
    options.htmlOptions?.id ?? options.id,
    options.htmlOptions?.onClick ?? options?.onClick ?? (() => { }),
    deepMerge({
      tooltip: options.tooltip,
      label: options.label,
      labelPosition: 'center', 
    }, options.htmlOptions?.options),
    deepMerge({
      button: {
        classList: ['deeplib-button'],
        children: [
          options.image ? {
            tag: 'img',
            attributes: {
              id: `${options.id}-image`,
              alt: '',
              disabled: options.disabled,
              decoding: 'async',
              loading: 'lazy',
              src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // 1x1 transparent image to get rid of broken image
            },
            style: {
              '--image': `url("${options.image}")`,
            },
          } : undefined,
        ],
      },
    }, options.htmlOptions?.htmlOptions ?? {}));

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
    children: [
      deepMerge({
        tag: 'input',
        classList: ['deeplib-input'],
        attributes: {
          type: 'checkbox',
          id: options.id,
          checked: options?.getSettingValue?.() || undefined,
        },
      }, options.htmlOptions),
      {
        tag: 'label',
        classList: ['deeplib-text'],
        attributes: {
          for: options.id,
        },
        children: [options.label]
      },
    ],
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

  const retElem = ElementCreate(options.htmlOptions);

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
    children: [
      deepMerge({
        tag: 'input',
        classList: ['deeplib-input'],
        attributes: {
          type: options.type,
          id: options.id,
          placeholder: ' ',
        },
      }, options.htmlOptions),
      options.label ? {
        tag: 'label',
        classList: ['deeplib-text'],
        attributes: {
          for: options.id,
        },
        children: [options.label]
      } : undefined,
    ],
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
      deepMerge({
        tag: 'span',
        classList: ['deeplib-label', 'deeplib-text'],
        attributes: {
          id: options.id
        },
        children: [
          options.label,
        ],
      }, options.htmlOptions),
    ],
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

