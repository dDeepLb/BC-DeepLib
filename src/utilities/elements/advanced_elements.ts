import { Button, Checkbox, Custom, Input, Label } from '../../base/elements_typings';
import { BaseSubscreen } from '../../deeplib';
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

  createBackNext: elementPrevNext,

  openModal: openModal,
  openAsyncModal: openAsyncModal,
};

function elementCreateButton(options: Button): HTMLButtonElement {
  const elem = document.getElementById(options.id) as HTMLButtonElement;

  if (elem) return elem;

  const disabled = typeof options?.disabled === 'function' ? options?.disabled() : options?.disabled;

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
        attributes: {
          disabled: disabled,
        },
        children: [
          options.image ? {
            tag: 'img',
            attributes: {
              id: `${options.id}-image`,
              alt: '',
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

  BaseSubscreen.currentElements.push([button, options]);

  return button;
};

function elementCreateCheckbox(options: Checkbox) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const disabled = typeof options?.disabled === 'function' ? options?.disabled() : options?.disabled;

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-checkbox-container'],
    attributes: {
      id: `${options.id}-container`,
    },
    children: [
      deepMerge({
        tag: 'input',
        classList: ['checkbox', 'deeplib-input'],
        attributes: {
          type: 'checkbox',
          id: options.id,
          disabled: disabled,
          checked: options?.setElementValue?.() || undefined,
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
    eventListeners: {
      change: () => {
        options?.setSettingValue?.((document.getElementById(options.id) as HTMLInputElement)?.checked);
      }
    }
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

  const disabled = typeof options?.disabled === 'function' ? options?.disabled() : options?.disabled;

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
          disabled: disabled,
          value: options?.setElementValue?.() || undefined,
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
    eventListeners: {
      input: () => {
        options?.setSettingValue?.((document.getElementById(options.id) as HTMLInputElement)?.value);
      }
    }
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

function elementCreateLabel(options: Label) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const retElem = ElementCreate(deepMerge({
    tag: 'span',
    classList: ['deeplib-label', 'deeplib-text'],
    attributes: {
      id: options.id
    },
    children: [
      options.label,
    ],
  }, options.htmlOptions));

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

interface PrevNext {
  id: string,
  initialLabel?: string
  back: (arg0: PrevNextCallbacks) => void,
  initialPrevTooltip?: string,
  next: (arg0: PrevNextCallbacks) => void,
  initialNextTooltip?: string
};

interface PrevNextCallbacks {
  setLabel: (label: string) => void,
  setBackTooltip: (tooltip: string) => void,
  setNextTooltip: (tooltip: string) => void
}

function elementPrevNext(options: PrevNext) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  const setLabel = (label: string) => {
    const elem = document.getElementById(`${options.id}-label`);
    if (!elem) return false;
    elem.textContent = label;
  }

  const setPrevTooltip = (tooltip: string) => {
    const elem = document.getElementById(`deeplib-prev-next-${options.id}-prev-button-tooltip`);
    if (!elem) return false;
    elem.textContent = tooltip;
  }

  const setNextTooltip = (tooltip: string) => {
    const elem = document.getElementById(`deeplib-prev-next-${options.id}-next-button-tooltip`);
    if (!elem) return false;
    elem.textContent = tooltip;
  }

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-prev-next'],
    attributes: {
      id: options.id
    },
    children: [
      advancedElement.createButton({
        type: 'button',
        id: `deeplib-prev-next-${options.id}-prev-button`,
        size: [90, 90],
        image: 'Icons/Prev.png',
        onClick: () => {
          options.back({
            setLabel: setLabel,
            setBackTooltip: setPrevTooltip,
            setNextTooltip: setNextTooltip,
          });
        },
        tooltip: options.initialPrevTooltip,
        htmlOptions: {
          options: {
            noStyling: true
          }
        }
      }),
      advancedElement.createLabel({
        id: `${options.id}-label`,
        type: 'label',
        label: options.initialLabel
      }),
      advancedElement.createButton({
        type: 'button',
        id: `deeplib-prev-next-${options.id}-next-button`,
        size: [90, 90],
        image: 'Icons/Next.png',
        onClick: () => {
          options.next({
            setLabel: setLabel, 
            setBackTooltip: setPrevTooltip,
            setNextTooltip: setNextTooltip,
          });
        },
        tooltip: options.initialNextTooltip,
        htmlOptions: {
          options: {
            noStyling: true
          }
        }
      }),
    ]
  });

  return retElem;
}

type ModalOptions = {
  prompt: string | Node,
  input?: { defaultValue?: string, readOnly?: boolean, placeholder?: string, type: 'input' | 'textarea' },
  buttons?: { text: string, action: string }[],
  submitText: string,
  callback: (action: string, value: string) => void
};

function openModal(options: ModalOptions) {
  const modal = ElementCreate({
    tag: 'dialog',
    classList: ['deeplib-modal'],
    attributes: {
      id: 'deeplib-modal',
      open: true,
    },
    children: [
      {
        tag: 'div',
        classList: ['deeplib-modal-prompt'],
        children: [
          options.prompt
        ]
      },
    ],
    style: {
      fontFamily: CommonGetFontName()
    },
    eventListeners: {
      click: (event: MouseEvent) => {
        event.stopPropagation();
      }
    },
  });

  let inputValue = '';

  if (options.input) {
    const input = ElementCreate({
      tag: options.input.type,
      classList: ['deeplib-modal-input'],
      attributes: {
        id: 'deeplib-modal-input',
        placeholder: options.input.placeholder,
        readOnly: options.input.readOnly,
        value: options.input.defaultValue,
      },
      eventListeners: {
        change: function (this: HTMLInputElement | HTMLTextAreaElement) {
          inputValue = input.value;
        },
        keydown: (event: KeyboardEvent) => {
          event.stopPropagation();
        }
      },
      parent: modal
    });

    switch (options.input.type) {
      case 'input': {
        const el = input as HTMLInputElement;
        el.type = 'text';
      }
        break;
      case 'textarea': {
        const el = input as HTMLTextAreaElement;
        el.rows = 5;
        // for some reason setting the value on element creation doesn't 
        // work specifically for textarea, so this is a workaround
        el.value = options.input.defaultValue || '';
      }
        break;
      default:
        throw new Error(`invalid input type ${options.input.type}`);
    }
  }

  const buttonContainer = ElementCreate({
    tag: 'div',
    classList: ['deeplib-modal-button-container'],
  });
  modal.append(buttonContainer);

  const submit = advancedElement.createButton({
    type: 'button',
    id: 'deeplib-modal-submit',
    label: options.submitText || 'Submit',
    onClick: () => {
      close('submit');
    }
  });

  const buttons = options.buttons?.map(button => {
    return advancedElement.createButton({
      type: 'button',
      id: `deeplib-modal-${button.action}`,
      label: button.text,
      onClick: () => {
        close(button.action);
      }
    });
  }) as HTMLButtonElement[];
  buttons?.unshift(submit);

  buttonContainer.append(...buttons);

  const blocker = ElementCreate({
    tag: 'div',
    classList: ['deeplib-modal-blocker'],
    attributes: {
      id: 'deeplib-modal-blocker',
      // FIXME: translate
      title: 'Click to close the modal',
    },
    eventListeners: {
      click: () => {
        close();
      }
    },
  });

  document.body.append(blocker);
  document.body.append(modal);

  const disabledUntil = Date.now() + 1000;
  function close(action: string = 'close') {
    if (Date.now() < disabledUntil) {
      return;
    }
    modal.close();
    modal.remove();
    blocker.remove();
    options.callback(action, inputValue);
  }
}

function openAsyncModal(options: Omit<ModalOptions, 'callback'>) {
  return new Promise<[string, string]>(resolve => {
    openModal({
      ...options,
      callback: (action, value) => {
        resolve([action, value]);
      }
    });
  });
}
