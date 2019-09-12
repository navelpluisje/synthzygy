import template from './template.html'
import style from './style.css'
import { CustomElement } from '../CustomElement'

@CustomElement({
  selector: 'np-moduleitem',
  template,
  style,
})
export class ListModuleItem extends HTMLElement {
  button: HTMLButtonElement
  clickEvent: Event
  name: string
  group: string

  constructor() {
    super()

    this.clickEvent = new CustomEvent('itemclick', {
      bubbles: true,
      cancelable: false,
    });
  }

  connectedCallback() {
    this.name = this.getAttribute('name') || ''
    this.group = this.getAttribute('group') || ''
    this.button = this.shadowRoot.querySelector('button')

    this.button.className = this.group
    this.setEventBindings()
  }

  setEventBindings() {
    this.button.addEventListener('click', () => {
      this.dispatchEvent(this.clickEvent)
    })
  }
}
