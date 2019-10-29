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
    document.getElementById('load-patch').addEventListener('floatmenu-click', this.loadPatch);
    // @ts-ignore
    document.getElementById('save-patch').addEventListener('floatmenu-click', this.savePatch);
    // @ts-ignore
    document.getElementById('clear-patch').addEventListener('floatmenu-click', this.clearPatch);
  }

  private loadPatch = () => {
    const patch = this.patches.new;
    this.synth.loadPatch(patch);

  }

  private savePatch = () => {
    const patch = this.synth.getPatchData();
    if (this.currentPatch !== '') {
      this.patches[this.currentPatch] = patch;
    } else {
      // Request for a name
      this.patches.new = patch;
    }
    localStorage.setItem('patches', JSON.stringify(this.patches));
  }

  private clearPatch = () => {
    this.currentPatch = '';

  }
}
