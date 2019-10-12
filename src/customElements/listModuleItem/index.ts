import { CustomElement } from '../CustomElement';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-moduleitem',
  style,
  template,
})
export class ListModuleItem extends HTMLElement {
  public button: HTMLButtonElement;
  public clickEvent: Event;
  public name: string;
  public group: string;

  constructor() {
    super();

    this.clickEvent = new CustomEvent('itemclick', {
      bubbles: true,
      cancelable: false,
    });
  }

  public connectedCallback() {
    this.name = this.getAttribute('name') || '';
    this.group = this.getAttribute('group') || '';
    this.button = this.shadowRoot.querySelector('button');

    this.button.className = this.group;
    this.setEventBindings();
  }

  public setEventBindings() {
    this.button.addEventListener('click', () => {
      this.dispatchEvent(this.clickEvent);
    });
  }
}
