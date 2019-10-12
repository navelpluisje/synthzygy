import { SetMidiDevice } from 'src/types';
import { CustomElement } from '../CustomElement';
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
  public overlay: HTMLDivElement;
  public show: boolean;
  public clickEvent: Event;
  public options: Array<[string, string]>;
  public callback: SetMidiDevice;

  static get observedAttributes() { return ['show']; }

  public connectedCallback() {
    this.button = this.shadowRoot.querySelector('button');
    this.select = this.shadowRoot.querySelector('select');
    this.overlay = this.shadowRoot.querySelector('.overlay');

    this.setEventBindings();
  }

  public setEventBindings() {
    this.button.addEventListener('click', () => {
      const value = this.select.options[this.select.selectedIndex].value;
      this.callback(value);
      this.togglePanel(false);
    });
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
}
