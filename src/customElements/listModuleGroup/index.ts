import template from './template.html'
import style from './style.css'

class ListModuleGroup extends HTMLElement {
  title: string
  name: string
  height: string
  titleDOM: HTMLHeadingElement
  listDOM: HTMLUListElement
  listContainerDOM: HTMLElement
  open: boolean = false

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

    this.titleDOM = this.shadowRoot.querySelector('h4')
    this.titleDOM.textContent = this.title

    this.listContainerDOM = this.shadowRoot.querySelector('#list')
    this.listDOM = this.shadowRoot.querySelector('ul')
    this.listDOM.className = this.name

    this.shadowRoot.querySelector('dd').className = this.name

    this.setEventBindings()
  }

  toggleList = () => {
    if (this.open) {
      this.listContainerDOM.style.height = '0px'
    } else {
      const height = this.listDOM.getBoundingClientRect().height
      this.listContainerDOM.style.height = `${height}px`
    }
    this.open = !this.open
  }

  setEventBindings() {
    this.titleDOM.addEventListener('click', this.toggleList)
  }
}

export default () => customElements.define('np-modulegroup', ListModuleGroup)

