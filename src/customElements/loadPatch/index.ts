import { SetPatchName } from 'src/types';
import { CustomElement } from '../CustomElement';
import { Modal } from '../modal';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-loadpatch',
  style,
  template,
})
export class LoadPatch extends HTMLElement {
  public modal: Modal;
  public show: boolean;
  public clickEvent: Event;
  public name: string;
  public callback: SetPatchName;
  private select: HTMLSelectElement;
  private init: boolean = true;

  static get observedAttributes() { return ['show']; }

  public connectedCallback() {
    this.select = this.shadowRoot.querySelector('select');
    this.modal = this.shadowRoot.querySelector('np-modal');
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'show':
        this.modal.togglePanel(oldValue === null);
        if (this.init) {
          this.init = false;
          this.modal.setActionCallback(this.setPatchName);
          this.modal.setCancelCallback(this.cancelModal);
        }
    }
  }

  public setValues = (values: string[] = [], callback: SetPatchName) => {
    this.callback = callback;
    this.select.innerHTML = '';
    values.forEach((value) => this.addOption(value));
  }

  public addOption(value: string) {
    this.select.appendChild(
      document.createRange()
        .createContextualFragment(`<option value="${value}">${value}</option>`),
    );
  }

  private setPatchName = () => {
    const value = this.select.options[this.select.selectedIndex].value;
    this.callback(value);
    this.cancelModal();
  }

  private cancelModal = () => {
    this.removeAttribute('show');
    this.modal.hideModal();
  }
}
