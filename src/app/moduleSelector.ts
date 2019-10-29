import { Synth } from 'src/app/synth';
import { AvailableModules } from 'src/constants/modules';

export class ModuleSetector {
  private callback: (name: string) => void;
  private menuDom: HTMLElement;

  constructor(synth: Synth) {
    this.callback = synth.addModule;
    this.menuDom = document.getElementById('module-list');
    this.addMenuItems();
  }

  public addMenuItems() {
    AvailableModules.forEach((category) => {
      const catElement = document.createElement('np-modulegroup');
      catElement.setAttribute('group', category.title);
      catElement.setAttribute('name', category.name);
      this.menuDom.appendChild(catElement);
      catElement.addEventListener('click', this.toggleModuleGroup);
      category.modules.forEach((module) => {
        const modElement = document.createElement('np-moduleitem');
        modElement.setAttribute('group', category.name);
        modElement.setAttribute('name', module.name);
        modElement.textContent = module.title;
        // @ts-ignore
        modElement.addEventListener('itemclick', ({ target }) => this.callback(target.name));
        catElement.appendChild(modElement);
      });
    });
  }

  public toggleModuleGroup = (evt: MouseEvent) => {
    const target = (evt.currentTarget as HTMLElement);
    const isOpen = target.hasAttribute('open');
    const groups = document.querySelectorAll('np-modulegroup');

    groups.forEach((group) => group.removeAttribute('open'));
    if (!isOpen) {
      target.setAttribute('open', '');
    }
  }
}
