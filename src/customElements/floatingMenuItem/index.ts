import { CustomElement } from '../CustomElement';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-floatingmenuitem',
  style,
  template,
})
export class FloatingMenuItem extends HTMLElement {
  public button: HTMLButtonElement;
  public iconElement: HTMLSpanElement;
  public clickEvent: Event;
  public icon: string;

  constructor() {
    super();

    this.clickEvent = new CustomEvent('floatmenu-click', {
      bubbles: true,
      cancelable: false,
    });
  }

  public connectedCallback() {
    this.icon = this.getAttribute('icon') || 'heart';
    this.button = this.shadowRoot.querySelector('button');
    this.iconElement = this.shadowRoot.querySelector('span');

    this.addFontStyle();

    this.iconElement.classList.add(`icon-${this.icon}`);
    this.setEventBindings();
  }

  public setEventBindings() {
    this.button.addEventListener('click', () => {
      this.dispatchEvent(this.clickEvent);
    });
  }

  private addFontStyle() {
    const iconStyle = document.createElement('link');
    iconStyle.rel = 'stylesheet';
    iconStyle.href = '/assets/fonts/icons.css';
    this.shadowRoot.appendChild(iconStyle);
  }
}
