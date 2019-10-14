import { setCssColors } from '@utilities/colors';
import { Menu } from './app/menu';
import { Synth } from './app/synth';
import { ListModuleGroup } from './customElements/listModuleGroup';
import { ListModuleItem } from './customElements/listModuleItem';
import { MidiSettings } from './customElements/midiSettings';

/* tslint:disable */
new ListModuleGroup();
new ListModuleItem();
new MidiSettings();
setCssColors();

const synth = new Synth();
new Menu(synth.addModule);
synth.start();
