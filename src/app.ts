import { setCssColors } from '@utilities/colors'
import ListModuleGroup from './customElements/listModuleGroup'
import ListModuleItem from './customElements/listModuleItem'
// import MidiSettings from './customElements/midiSettings'
import { Synth } from './app/synth';
import { Menu } from './app/menu';

ListModuleGroup()
ListModuleItem()
// MidiSettings()
setCssColors()

const synth = new Synth()
const menu = new Menu(synth.addModule)
synth.start()