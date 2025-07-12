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
};

function elementCreateButton(options: Omit<Button, 'type'>): HTMLButtonElement {
  const elem = document.getElementById(options.id) as HTMLButtonElement;

  if (elem) return elem;

  (options as Button).type = 'button';

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

  BaseSubscreen.currentElements.push([button, options as Button]);

  return button;
};

function elementCreateCheckbox(options: Omit<Checkbox, 'type'>) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  (options as Checkbox).type = 'checkbox';

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

  BaseSubscreen.currentElements.push([retElem, options as Checkbox]);

  return retElem;
}

function elementCreateCustom(options: Omit<Custom, 'type'>) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  (options as Custom).type = 'custom';

  const retElem = ElementCreate(options.htmlOptions);

  BaseSubscreen.currentElements.push([retElem, options as Custom]);

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

function elementCreateLabel(options: Omit<Label, 'type'>) {
  const elem = document.getElementById(options.id);

  if (elem) return elem;

  (options as Label).type = 'label';

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

  BaseSubscreen.currentElements.push([retElem, options as Label]);

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
  };

  const setPrevTooltip = (tooltip: string) => {
    const elem = document.getElementById(`deeplib-prev-next-${options.id}-prev-button-tooltip`);
    if (!elem) return false;
    elem.textContent = tooltip;
  };

  const setNextTooltip = (tooltip: string) => {
    const elem = document.getElementById(`deeplib-prev-next-${options.id}-next-button-tooltip`);
    if (!elem) return false;
    elem.textContent = tooltip;
  };

  const retElem = ElementCreate({
    tag: 'div',
    classList: ['deeplib-prev-next'],
    attributes: {
      id: options.id
    },
    children: [
      advancedElement.createButton({
        id: `deeplib-prev-next-${options.id}-prev-button`,
        image: `${PUBLIC_URL}/dl_images/arrow_left.svg`,
        onClick: () => {
          options.back({
            setLabel: setLabel,
            setBackTooltip: setPrevTooltip,
            setNextTooltip: setNextTooltip,
          });
        },
        tooltip: options.initialPrevTooltip,
        htmlOptions: {
          htmlOptions: {
            button: {
              classList: ['deeplib-prev-next-button']
            }
          },
          options: {
            noStyling: true
          }
        }
      }),
      advancedElement.createLabel({
        id: `${options.id}-label`,
        label: options.initialLabel,
        htmlOptions: {
          classList: ['deeplib-prev-next-label']
        }
      }),
      advancedElement.createButton({
        id: `deeplib-prev-next-${options.id}-next-button`,
        image: `${PUBLIC_URL}/dl_images/arrow_right.svg`,
        onClick: () => {
          options.next({
            setLabel: setLabel,
            setBackTooltip: setPrevTooltip,
            setNextTooltip: setNextTooltip,
          });
        },
        tooltip: options.initialNextTooltip,
        htmlOptions: {
          htmlOptions: {
            button: {
              classList: ['deeplib-prev-next-button']
            }
          },
          options: {
            noStyling: true
          }
        }
      }),
    ]
  });

  return retElem;
}

export type ModalButton<T extends string = string> = {
  text: string
  action: T
  disabled?: boolean
};

export type ModalInputOptions = {
  defaultValue?: string
  readOnly?: boolean
  placeholder?: string
  type: 'input' | 'textarea'
  validate?: (value: string) => string | null
};

export type ModalOptions<T extends string = string> = {
  prompt: string | Node
  input?: ModalInputOptions
  buttons?: ModalButton<T>[]
  closeOnBackdrop?: boolean
  timeoutMs?: number
};

export class Modal<T extends string = string> {
  private dialog: HTMLDialogElement;
  private blocker: HTMLDivElement;
  private inputEl?: HTMLInputElement | HTMLTextAreaElement;
  private timeoutId?: number;

  private static queue: Modal<any>[] = [];
  private static processing = false;

  constructor(private opts: ModalOptions<T>) {
    opts ??= {} as ModalOptions<T>;
    opts.closeOnBackdrop ??= true;

    const promptId = `modal-prompt-${Date.now()}`;

    this.dialog = ElementCreate({
      tag: 'dialog',
      classList: ['deeplib-modal'],
      attributes: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': promptId
      },
      style: {
        fontFamily: CommonGetFontName()
      },
      children: [
        opts.prompt,
        {
          tag: 'div',
          classList: ['deeplib-modal-prompt'],
          attributes: {
            id: promptId
          },
          children: [
            opts.input ? this.renderInput(opts.input) : undefined,
          ]
        },
        this.renderButtons()
      ]
    });

    this.blocker = this.createBlocker();

    this.renderButtons();
    document.body.append(this.createBlocker(), this.dialog);
    this.setupFocusTrap();
    if (opts.timeoutMs) {
      this.timeoutId = window.setTimeout(() => this.close('timeout' as T), opts.timeoutMs);
    }
  }

  show(): Promise<[T, string | null]> {
    return Modal.enqueue(this);
  }

  static async alert(msg: string, timeoutMs?: number) {
    await new Modal({ prompt: msg, buttons: [{ action: 'close', text: 'OK' }], timeoutMs }).show();
  }

  static async confirm(msg: string) {
    const [action] = await new Modal({ prompt: msg, buttons: [{ text: 'Cancel', action: 'cancel' }, { text: 'OK', action: 'ok' }] }).show();
    return action === 'ok';
  }

  static async prompt(msg: string, defaultValue = ''): Promise<string | null> {
    const [action, value] = await new Modal({ prompt: msg, timeoutMs: 0, input: { type: 'input', defaultValue }, buttons: [{ text: 'Cancel', action: 'cancel' }, { text: 'Submit', action: 'submit' }] }).show();
    return action === 'submit' ? value : null;
  }

  private renderInput(cfg: ModalInputOptions) {
    const el = document.createElement(cfg.type);
    el.classList.add('deeplib-modal-input');
    if (cfg.placeholder) el.placeholder = cfg.placeholder;
    if (cfg.readOnly) el.readOnly = true;
    if (cfg.defaultValue) el.value = cfg.defaultValue;
    if (cfg.type === 'textarea') (el as HTMLTextAreaElement).rows = 5;
    el.addEventListener('input', () => {
      const err = cfg.validate?.(el.value);
      el.setCustomValidity(err || '');
    });
    this.inputEl = el;

    return el;
  }

  private renderButtons() {
    const container = document.createElement('div');
    container.classList.add('deeplib-modal-button-container');

    const btns = this.opts.buttons ? [...this.opts.buttons] : [];

    btns.forEach(b => {
      const btn = advancedElement.createButton({
        label: b.text,
        id: `deeplib-modal-${b.action}`,
        disabled: b.disabled,
        onClick: () => this.close(b.action)
      });
      container.append(btn);
    });

    return container;
  }

  private createBlocker() {
    const blocker = document.createElement('div');
    blocker.classList.add('deeplib-modal-blocker');
    blocker.title = 'Click to close';
    if (this.opts.closeOnBackdrop !== false)
      blocker.addEventListener('click', () => this.close('close' as T));

    return blocker;
  }

  private setupFocusTrap() {
    const focusable = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(this.dialog.querySelectorAll<HTMLElement>(focusable));
    const first = elements[0];
    const last = elements[elements.length - 1];
    this.dialog.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        if (elements.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        this.close('close' as T);
      }
    });
    window.requestAnimationFrame(() => {
      (this.inputEl || first)?.focus();
    });
  }

  private close(action: T) {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.dialog.close();
    this.dialog.remove();
    this.blocker.remove();
    document.body.querySelector('.deeplib-modal-blocker')?.remove();
    const value = this.inputEl?.value ?? '';
    this.resolve([action, value]);
    Modal.dequeue();
  }

  /**
   * An internal function where we will save promise function.
   */
  private resolve: (result: [T, string]) => void = () => { };

  /** A function that adds a modal to the queue and returns a promise */
  private static enqueue(modal: Modal<any>): Promise<[any, string]> {
    Modal.queue.push(modal);
    if (!Modal.processing) Modal.dequeue();
    return new Promise(resolve => (modal.resolve = resolve));
  }

  /** A function that processes the queue, removing the first modal */
  private static dequeue() {
    const modal = Modal.queue.shift();
    if (modal) {
      Modal.processing = true;
      modal.dialog.show();
    } else {
      Modal.processing = false;
    }
  }
}

(window as any).Modal = Modal;