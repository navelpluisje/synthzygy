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
  overlay:HTMLDivElement
  show: boolean
  clickEvent: Event
  options: [string, string][]
  callback: Function

  static get observedAttributes() { return ['show']; }

  connectedCallback() {
    this.button = this.shadowRoot.querySelector('button')
    this.select = this.shadowRoot.querySelector('select')
    this.overlay = this.shadowRoot.querySelector('.overlay')

    this.setEventBindings()
  }

  setEventBindings() {
    this.button.addEventListener('click', () => {
      const value = this.select.options[this.select.selectedIndex].value
      this.callback(value)
      this.togglePanel(false)
    })
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'show':
        this.togglePanel(oldValue === null)
    }
  }

  togglePanel(show: boolean) {
    if (show) {
      this.overlay.classList.remove('hidden')
    } else {
      this.overlay.classList.add('hidden')
    }

  }

  setValues = (values: [string, string][], active: string, callback: Function) => {
    this.options = values
    this.callback = callback
    this.select.innerHTML = ''
    this.addOption(['', 'Select a midi device'], '666')
    values.forEach(value => this.addOption(value, active))
  }

  addOption(value: [string, string], active: string) {
    const selected = value[0] === active ? 'selected' : ''
    this.select.appendChild(
      document.createRange()
        .createContextualFragment(`<option ${selected} value="${value[0]}">${value[1]}</option>`)
    )
  }
}
