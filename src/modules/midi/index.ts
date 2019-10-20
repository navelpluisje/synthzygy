import { ButtonGroup, Knob, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';
import { buttons } from './buttons';
import { controlTypes } from './controls';
import { MidiNode } from './midi.node';
import { outputTypes } from './outputs';

export class Midi extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 250,
    width: 180,
  };

  public type =  'midi';
  public title = 'Midi';
  public midiNode: MidiNode;
  public settingsPanel: HTMLElement;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.midiNode = new MidiNode(context);
    this.container = new SynthModule(canvas, Midi.dimensions, position, this.color);
    this.settingsPanel = document.querySelector('np-midisettings');
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addControls();
    this.addButtonControls();
  }

  public getNode() {
    return this.midiNode;
  }

  private addControls() {
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[0],
      this.midiNode.setMidiPort,
      Colors.AccentUtility,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[1],
      this.midiNode.setClockStepSize,
      Colors.AccentUtility,
    ));
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
      // @ts-ignore
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

  private getOutputConnection(type: string): ConstantSourceNode | MidiNode | {} {
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
        return this.midiNode;
      case 'Clock':
        return this.midiNode.clockNode();
      case 'Transport':
        return this.midiNode.transportNode();
    }
  }
}
