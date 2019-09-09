import { KeyboardNode } from '@nodes/keyboardNode'
import { MidiNode } from '@nodes/midiNode'
import { SynthModule, OutputConnector } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';

export class Midi extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 130,
    width: 100,
  }

  type =  'midi'
  title = 'Midi'
  node: KeyboardNode
  midiNode: MidiNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new KeyboardNode(context)
    this.midiNode = new MidiNode(context)
    this.container = new SynthModule(canvas, Midi.dimensions, position, this.color)
    this.addOutputs()
  }

  addOutputs() {
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

  private getOutputConnection(type: string): AudioWorkletNode | MidiNode {
    switch (type) {
      case 'gateOut':
        return this.midiNode
      case 'Freqency':
        return this.midiNode.noteOutput()
    }
  }


  getNode() {
    return this.node
  }
}