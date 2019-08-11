import template from './template.html'
import style from './style.css'

class ListModuleGroup extends HTMLElement {
  title: string
  name: string

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
    // this.clickEvent = new CustomEvent('click', {
    //   bubbles: true,
    //   cancelable: false,
    // });
  }

  connectedCallback() {
    this.title = this.getAttribute('group') || ''
    this.name = this.getAttribute('name') || ''

    this.shadowRoot.querySelector('h4').textContent = this.title
    this.shadowRoot.querySelector('dd').className = this.name
    this.shadowRoot.querySelector('ul').className = this.name

    // this.setEventBindings()
  }

  setEventBindings() {
    // this.button.addEventListener('click', () => this.dispatchEvent(this.clickEvent))
  }
}

export default () => customElements.define('np-modulegroup', ListModuleGroup)

