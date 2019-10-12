import { setCssColors } from '@utilities/colors';
import { Menu } from './app/menu';
import { Synth } from './app/synth';
import { ListModuleGroup } from './customElements/listModuleGroup';
import { ListModuleItem } from './customElements/listModuleItem';
import { MidiSettings } from './customElements/midiSettings';

const lmg = new ListModuleGroup();
const lmi = new ListModuleItem();
const ms = new MidiSettings();
setCssColors();

const synth = new Synth();
const menu = new Menu(synth.addModule);
synth.start();
