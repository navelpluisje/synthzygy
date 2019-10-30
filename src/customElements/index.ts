import { FloatingMenu } from './floatingMenu';
import { FloatingMenuItem } from './floatingMenuItem';
import { ListModuleGroup } from './listModuleGroup';
import { ListModuleItem } from './listModuleItem';
import { LoadPatch } from './loadPatch';
import { MidiSettings } from './midiSettings';
import { Modal } from './modal';
import { SavePatch } from './savePatch';

export const initializeCustomElements = () => {
  /* tslint:disable */
  new Modal();
  new ListModuleGroup();
  new ListModuleItem();
  new MidiSettings();
  new SavePatch();
  new LoadPatch();
  new FloatingMenu();
  new FloatingMenuItem();
}