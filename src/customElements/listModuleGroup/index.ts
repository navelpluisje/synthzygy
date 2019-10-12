import { CustomElement } from '../CustomElement';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-modulegroup',
  style,
  template,
})
export class ListModuleGroup extends HTMLElement {
  public title: string;
  public name: string;
  public height: string;
  public titleDOM: HTMLHeadingElement;
  public listDOM: HTMLUListElement;
  public listContainerDOM: HTMLElement;
  public open: boolean = false;

  static get observedAttributes() { return ['open']; }

  public connectedCallback() {
    this.title = this.getAttribute('group') || '';
    this.name = this.getAttribute('name') || '';

    this.titleDOM = this.shadowRoot.querySelector('h4');
    this.titleDOM.textContent = this.title;

    this.listContainerDOM = this.shadowRoot.querySelector('#list');
    this.listDOM = this.shadowRoot.querySelector('ul');
    this.listDOM.className = this.name;

    this.shadowRoot.querySelector('dd').className = this.name;
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'open':
        this.toggleList(newValue !== null);
    }
  }

  public toggleList(open: boolean) {
    this.open = open;
    if (this.open) {
      const height = this.listDOM.getBoundingClientRect().height;
      this.listContainerDOM.style.height = `${height}px`;
    } else {
      this.listContainerDOM.style.height = '0px';
    }
  }
}
