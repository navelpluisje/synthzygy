import template from './template.html'
import style from './style.css'

class MidiSettings extends HTMLElement {
  button: HTMLButtonElement
  clickEvent: Event
  name: string
  group: string

  static get observedAttributes() { return ['data']; }

  constructor() {
    super()
    const bodyTemplate = document.createElement('div')
    bodyTemplate.innerHTML = template
    const templateContent = <HTMLTemplateElement>bodyTemplate.firstChild
    const styling = document.createElement('style')
    styling.innerHTML = style

    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(templateContent.content.cloneNode(true))
    shadowRoot.appendChild(styling.cloneNode(true))

    // Create Events
    this.clickEvent = new CustomEvent('itemclick', {
      bubbles: true,
      cancelable: false,
    });
  }

  connectedCallback() {
    this.name = this.getAttribute('name') || ''
    this.group = this.getAttribute('group') || ''
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log({name, oldValue, newValue});
  }
}

export default () => customElements.define('np-midisettings', MidiSettings)

