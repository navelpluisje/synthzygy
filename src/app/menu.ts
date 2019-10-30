import { LoadPatch } from 'src/customElements/loadPatch';
import { SavePatch } from 'src/customElements/savePatch';
import { PatchData } from 'src/types';
import { Synth } from './synth';

export class Menu {
  private synth: Synth;
  private currentPatch: string = '';
  private patches: Record<string, PatchData>;

  constructor(synth: Synth) {
    this.synth = synth;
    this.patches = JSON.parse(localStorage.getItem('patches') || '{}');
    this.addEventListeners();
  }

  private addEventListeners() {
    // @ts-ignore
    document.getElementById('load-patch').addEventListener('floatmenu-click', this.showLoadPatchModal);
    // @ts-ignore
    document.getElementById('save-patch').addEventListener('floatmenu-click', this.savePatch);
    // @ts-ignore
    document.getElementById('clear-patch').addEventListener('floatmenu-click', this.clearPatch);
  }

  private loadPatch = (name: string) => {
    const patch = this.patches[name];
    this.synth.loadPatch(patch);
  }

  private savePatch = () => {
    const patch = this.synth.getPatchData();
    if (this.currentPatch !== '') {
      this.saveNamedPatch(patch)(this.currentPatch);
    } else {
      this.showSavePatchModal(patch);
    }
  }

  private showSavePatchModal(patch: PatchData) {
    const dom = document.createElement('np-savepatch');
    document.body.appendChild(dom);

    const modal: SavePatch = document.querySelector('np-savepatch');
    modal.setName('test', this.saveNamedPatch(patch));
    modal.setAttribute('show', '');
  }

  private showLoadPatchModal = () => {
    const dom = document.createElement('np-loadpatch');
    document.body.appendChild(dom);

    const modal: LoadPatch = document.querySelector('np-loadpatch');
    modal.setValues(Object.keys(this.patches), this.loadPatch);
    modal.setAttribute('show', '');
  }

  private saveNamedPatch = (patch: PatchData) => (name: string) => {
    this.patches[name] = patch;
    localStorage.setItem('patches', JSON.stringify(this.patches));
}

  private clearPatch = () => {
    // this.currentPatch = '';

  }
}
