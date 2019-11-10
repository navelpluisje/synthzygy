import { ButtonGroup, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { MidiSettings } from 'src/customElements/midiSettings';
import { DimensionType, ModuleDefaultValues, PositionType } from 'src/types';
import { buttons } from './midi.buttons';
import { knobTypes } from './midi.knobs';
import { MidiNode } from './midi.node';
import { outputTypes } from './midi.outputs';

export class Midi extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 250,
    width: 180,
  };
  private static initialValues: ModuleDefaultValues = {
    'clock': 3,
    'midi port': 0,
  };

  public type =  'midi';
  public title = 'Midi';
  private midiNode: MidiNode;
  private settingsPanel: MidiSettings;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...Midi.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentUtility;
    this.midiNode = new MidiNode(context);
    this.container = new SynthModule(canvas, Midi.dimensions, position, this.color);
    this.settingsPanel = document.querySelector('np-midisettings');
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
    this.addButtonControls();
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      'clock': this.midiNode.getClockStepSize(),
      'midi port': this.midiNode.getMidiPort(),
    };
  }

  private addButtonControls() {
    buttons.forEach((buttonGroup) => {
      this.buttons.push(new ButtonGroup(
        this.canvas,
        this,
        buttonGroup,
        this.showMidiSettings,
        Colors.AccentUtility,
        true,
      ));
    });
  }

  private showMidiSettings = () => {
    if (this.settingsPanel.hasAttribute('show')) {
      this.settingsPanel.removeAttribute('show');
    } else {
      this.settingsPanel.setValues(
        this.midiNode.getMidiInputs(),
        this.midiNode.getActiveInput(),
        this.setMidiDevice,
      );
      this.settingsPanel.setAttribute('show', '');
      this.buttons[0].setActiveButton(null);
    }
  }

  private setMidiDevice = (id: string) => {
    this.midiNode.setMidiDevice(id);
    this.settingsPanel.removeAttribute('show');
  }

  private getOutputConnection = (type: string): ConstantSourceNode | MidiNode | {} => {
    switch (type) {
      case 'V/Oct':
        return this.midiNode.noteOutput();
      case 'Pitch':
        return this.midiNode.pitchOutput();
      case 'Mod':
        return this.midiNode.modulationOutput();
      case 'Press':
        return this.midiNode.aftertouchOutput();
      case 'Gate':
        return this.midiNode.gateOuptput();
      case 'Clock':
        return this.midiNode.clockNode();
      case 'Transport':
        return this.midiNode.transportNode();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'midi port':
        return {
          callback: this.midiNode.setMidiPort,
          default: this.defaults[key],
        };
      case 'clock':
        return {
          callback: this.midiNode.setClockStepSize,
          default: this.defaults[key],
        };
    }
  }
}
