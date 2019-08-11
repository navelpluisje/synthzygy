import { setCssColors } from '@utilities/colors'
import ListModuleGroup from './customElements/listModuleGroup'
import ListModuleItem from './customElements/listModuleItem'
import { Synth } from './app/synth';
import { Menu } from './app/menu';

ListModuleGroup()
ListModuleItem()
setCssColors()

const synth = new Synth()
const menu = new Menu(synth.addModule)
synth.start()