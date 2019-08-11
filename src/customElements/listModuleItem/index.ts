import template from './template.html'
import style from './style.css'

class ListModuleItem extends HTMLElement {
  button: HTMLButtonElement
  clickEvent: Event
  name: string
  group: string

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

export default () => customElements.define('np-moduleitem', ListModuleItem)

