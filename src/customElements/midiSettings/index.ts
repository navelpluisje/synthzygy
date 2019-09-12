import template from './template.html'
import style from './style.css'
import { CustomElement } from '../CustomElement'

@CustomElement({
  selector: 'np-midisettings',
  template,
  style,
})
export class MidiSettings extends HTMLElement {
  button: HTMLButtonElement
  select: HTMLSelectElement
  clickEvent: Event

  static get observedAttributes() { return ['data']; }

  connectedCallback() {
    this.button = this.shadowRoot.querySelector('button')
    this.select = this.shadowRoot.querySelector('select')

    this.setEventBindings()
  }

  setEventBindings() {
    this.button.addEventListener('click', (e) => console.log(this.select.selectedIndex))
  }

  setValues = (values: string[]) => {
    values.forEach(value => this.addOption(value))
  }

  addOption(value: string) {
    // alert(value)
  }
}
