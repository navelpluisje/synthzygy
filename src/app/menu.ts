import { Synth } from 'src/app/synth';
import { AvailableModules } from 'src/constants/modules';

export class Menu {
  private callback: (category: string, name: string) => void;
  private menuDom: HTMLElement;
  private synth: Synth;

  constructor(synth: Synth) {
    this.callback = synth.addModule;
    this.synth = synth;
    this.menuDom = document.getElementById('module-list');
    this.addMenuItems();
    this.setEventListeners();
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
        modElement.addEventListener('itemclick', ({ target }) => this.callback(target.category, target.name));
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

  private setEventListeners() {
    document.getElementById('save').addEventListener('click', () => {
      localStorage.setItem('saved', JSON.stringify(this.synth.getPatchData()));
    });

    document.getElementById('load').addEventListener('click', () => {
      const patch = JSON.parse(localStorage.getItem('saved'));
      this.synth.loadPatch(patch)
    });
  }
}
