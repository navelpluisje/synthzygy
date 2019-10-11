import { AvailableModules } from "src/constants/modules";

export class Menu {
  callback: Function
  menuDom: HTMLElement

  constructor(callback: Function) {
    this.callback = callback
    this.menuDom = document.getElementById('module-list')
    this.addMenuItems()
  }

  addMenuItems() {
    AvailableModules.forEach(category => {
      const catElement = document.createElement('np-modulegroup')
      catElement.setAttribute('group', category.title)
      catElement.setAttribute('name', category.name)
      this.menuDom.appendChild(catElement)
      catElement.addEventListener('click', this.toggleModuleGroup)
      category.modules.forEach(module => {
        const modElement = document.createElement('np-moduleitem')
        modElement.setAttribute('group', category.name)
        modElement.setAttribute('name', module.name)
        modElement.textContent = module.title
        // @ts-ignore
        modElement.addEventListener('itemclick', ({ target }) => this.callback(target.category, target.name))
        catElement.appendChild(modElement)
      })
    })
  }

  toggleModuleGroup = (evt: MouseEvent) => {
    const target = (<HTMLElement>evt.currentTarget)
    const isOpen = target.hasAttribute('open')
    const groups = document.querySelectorAll('np-modulegroup')

    groups.forEach(group => group.removeAttribute('open'));
    !isOpen && target.setAttribute('open', '')
  }
}