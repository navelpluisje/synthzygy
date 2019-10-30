import { setCssColors } from '@utilities/colors';
import { Menu } from './app/menu';
import { ModuleSetector } from './app/moduleSelector';
import { Synth } from './app/synth';
import { FloatingMenu } from './customElements/floatingMenu';
import { FloatingMenuItem } from './customElements/floatingMenuItem';
import { ListModuleGroup } from './customElements/listModuleGroup';
import { ListModuleItem } from './customElements/listModuleItem';
import { LoadPatch } from './customElements/loadPatch';
import { MidiSettings } from './customElements/midiSettings';
import { Modal } from './customElements/modal';
import { SavePatch } from './customElements/savePatch';
import './style/app.css';

(function App() {
  /* tslint:disable */
  new Modal();
  new ListModuleGroup();
  new ListModuleItem();
  new MidiSettings();
  new SavePatch();
  new LoadPatch();
  new FloatingMenu();
  new FloatingMenuItem();
  setCssColors();

  const synth = new Synth();
  new ModuleSetector(synth);
  new Menu(synth);
  synth.start();
})();
