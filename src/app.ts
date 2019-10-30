import { setCssColors } from '@utilities/colors';
import { Menu } from './app/menu';
import { ModuleSetector } from './app/moduleSelector';
import { Synth } from './app/synth';
import { initializeCustomElements } from './customElements';
import './style/app.css';

(function App() {
  initializeCustomElements();
  setCssColors();

  const synth = new Synth();
  /* tslint:disable */
  new ModuleSetector(synth);
  new Menu(synth);
  synth.start();
})();
