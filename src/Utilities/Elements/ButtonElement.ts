import { Button } from 'Types/elements';
import { BaseSubscreen, deepLibLogger, elementSetPosition, elementSetSize } from '../../DeepLib';

export class DeeplibButton extends HTMLElement {
  private options: Button;
  constructor(options: Button) {
    super();

    this.options = options;
  }

  connectedCallback() {
    deepLibLogger.debug('DeeplibButton connectedCallback');
    this.id = this.options.id;
    this.classList.add('deeplib-button');

    if (this.options.size) {
      elementSetSize({ element: this }, this.options.size[0], this.options.size[1]);
    }

    if (this.options.position) {
      elementSetPosition({ element: this }, this.options.position[0], this.options.position[1]);
    }

    if (this.options.image) {
      const img = document.createElement('img');
      img.src = this.options.image;
      this.appendChild(img);
    }

    if (this.options.label) {
      const label = document.createElement('span');
      label.innerText = this.options.label;
      this.appendChild(label);
    }

    if (this.options.hoverHint) {
      /* */
    }

    const hoverHint = document.createElement('span');
    hoverHint.classList.add('deeplib-hover-hint');
    hoverHint.innerText = this.options.hoverHint ?? 'Hint';
    this.appendChild(hoverHint);


    this.addEventListener('click', this.options.onClick);

    BaseSubscreen.currentElements.push([this, this.options]);
  }
}

customElements.define('deeplib-button', DeeplibButton);
