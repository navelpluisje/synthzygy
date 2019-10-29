import { setCssColors } from '@utilities/colors';
import { Menu } from './app/menu';
import { ModuleSetector } from './app/moduleSelector';
import { Synth } from './app/synth';
import { FloatingMenu } from './customElements/floatingMenu';
import { FloatingMenuItem } from './customElements/floatingMenuItem';
import { ListModuleGroup } from './customElements/listModuleGroup';
import { ListModuleItem } from './customElements/listModuleItem';
import { MidiSettings } from './customElements/midiSettings';
import './style/app.css';

(function App() {
  /* tslint:disable */
  new ListModuleGroup();
  new ListModuleItem();
  new MidiSettings();
  new FloatingMenu();
  new FloatingMenuItem();
  setCssColors();

  const synth = new Synth();
  new ModuleSetector(synth);
  new Menu(synth);
  synth.start();
})();
