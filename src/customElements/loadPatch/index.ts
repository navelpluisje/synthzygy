import { SetPatchName } from 'src/types';
import { CustomElement } from '../CustomElement';
import { Modal } from '../modal';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-savepatch',
  style,
  template,
})
export class SavePatch extends HTMLElement {
  public nameInput: HTMLInputElement;
  public modal: Modal;
  public show: boolean;
  public clickEvent: Event;
  public name: string;
  public callback: SetPatchName;
  private init: boolean = true;

  static get observedAttributes() { return ['show']; }

  public connectedCallback() {
    this.nameInput = this.shadowRoot.querySelector('input');
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

  public setName = (name: string, callback: SetPatchName) => {
    this.name = name;
    this.callback = callback;
    this.nameInput.value = name;
  }

  private setPatchName = () => {
    const value = this.nameInput.value;
    this.callback(value);
    this.cancelModal();
  }

  private cancelModal = () => {
    this.removeAttribute('show');
    this.modal.hideModal();
  }
}
