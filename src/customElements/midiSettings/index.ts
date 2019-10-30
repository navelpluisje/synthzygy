import { SetMidiDevice } from 'src/types';
import { CustomElement } from '../CustomElement';
import { Modal } from '../modal';
import style from './style.css';
import template from './template.html';

@CustomElement({
  selector: 'np-midisettings',
  style,
  template,
})
export class MidiSettings extends HTMLElement {
  public button: HTMLButtonElement;
  public select: HTMLSelectElement;
  public modal: Modal;
  public show: boolean;
  public clickEvent: Event;
  public options: Array<[string, string]>;
  public callback: SetMidiDevice;
  private init: boolean = true;

  static get observedAttributes() { return ['show']; }

  public connectedCallback() {
    this.button = this.shadowRoot.querySelector('button');
    this.select = this.shadowRoot.querySelector('select');
    this.modal = this.shadowRoot.querySelector('np-modal');
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'show':
        this.modal.togglePanel(oldValue === null);
        if (this.init) {
          this.init = false;
          this.modal.setActionCallback(this.setMidiDevice);
          this.modal.setCancelCallback(this.cancelModal);
        }
    }
  }

  public setValues = (values: Array<[string, string]>, active: string, callback: SetMidiDevice) => {
    this.options = values;
    this.callback = callback;
    this.select.innerHTML = '';
    this.addOption(['', 'Select a midi device'], '666');
    values.forEach((value) => this.addOption(value, active));
  }

  public addOption(value: [string, string], active: string) {
    const selected = value[0] === active ? 'selected' : '';
    this.select.appendChild(
      document.createRange()
        .createContextualFragment(`<option ${selected} value="${value[0]}">${value[1]}</option>`),
    );
  }

  private setMidiDevice = () => {
    const value = this.select.options[this.select.selectedIndex].value;
    this.callback(value);
    this.cancelModal();
  }

  private cancelModal = () => {
    this.removeAttribute('show');
    this.modal.hideModal();
  }
}
