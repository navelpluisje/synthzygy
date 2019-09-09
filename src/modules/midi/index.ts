import { MidiNode } from '@nodes/midiNode'
import { SynthModule, OutputConnector, Rotary, ButtonGroup } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { buttons } from './buttons';

export class Midi extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 190,
    width: 180,
  }

  type =  'midi'
  title = 'Midi'
  midiNode: MidiNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.midiNode = new MidiNode(context)
    this.container = new SynthModule(canvas, Midi.dimensions, position, this.color)
    this.addOutputs()
    this.addControls()
    this.addButtonControls()
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      const key = output.type === 'gate' ? 'gate' : 'node'
      this.outputs.push({
        type: output.type,
        [key]: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  private addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.midiNode.setMidiPort, Colors.AccentGenerator))
  }

  private addButtonControls() {
    buttons.forEach(buttonGroup => {
      this.buttons.push(new ButtonGroup(this.canvas, this, buttonGroup, this.showMidiSettings, Colors.AccentGenerator, true))
    })
  }

  private showMidiSettings(x: string) {
    console.log(x)
  }

  private getOutputConnection(type: string): AudioWorkletNode | MidiNode {
    switch (type) {
      case 'V/Oct':
        return this.midiNode.noteOutput()
      case 'Pitch':
        return this.midiNode.pitchOutput()
      case 'Mod':
        return this.midiNode.modulationOutput()
      case 'Press':
        return this.midiNode.aftertouchOutput()
      case 'Gate':
        return this.midiNode
    }
  }

  getNode() {
    return this.midiNode
  }
}