import { CustomElement } from '../CustomElement';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-modal',
  style,
  template,
})
export class Modal extends HTMLElement {
  public actionButton: HTMLButtonElement;
  public cancelButton: HTMLButtonElement;
  public header: HTMLElement;
  public overlay: HTMLDivElement;
  public title: string;
  public actionTitle: string;
  private actionCallback: () => void;
  private cancelCallback: () => void;

  static get observedAttributes() { return ['show']; }

  public connectedCallback() {
    this.actionButton = this.shadowRoot.querySelector('#action');
    this.cancelButton = this.shadowRoot.querySelector('#cancel');
    this.header = this.shadowRoot.querySelector('header');
    this.overlay = this.shadowRoot.querySelector('.overlay');

    this.title = this.getAttribute('title') || '';
    this.actionTitle = this.getAttribute('action-title') || '';

    this.actionButton.textContent = this.actionTitle;
    this.header.textContent = this.title;

    this.setEventBindings();
  }

  public setEventBindings() {
    this.actionButton.addEventListener('click', () => this.actionCallback());
    this.cancelButton.addEventListener('click', () => this.cancelCallback());
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'show':
        this.togglePanel(oldValue === null);
    }
  }

  public togglePanel(show: boolean) {
    if (show) {
      this.overlay.classList.remove('hidden');
    } else {
      this.overlay.classList.add('hidden');
    }
  }

  public setActionCallback(callback: () => void) {
    this.actionCallback = callback;
  }

  public setCancelCallback(callback: () => void) {
    this.cancelCallback = callback;
  }

  public showModal() {
    this.togglePanel(true);
  }

  public hideModal() {
    this.togglePanel(false);
  }
}
