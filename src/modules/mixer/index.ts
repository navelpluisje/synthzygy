import { ModuleBase } from '../moduleBase';
import { MixerNode } from '@nodes/mixerNode'
import { SynthModule, InputConnector, OutputConnector, Rotary } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Mixer extends Module {
  getNode(): MixerNode
}

export class Mixer extends ModuleBase implements Mixer, ParentModule {
  static dimensions = {
    height: 245,
    width: 165,
  }

  type = 'mixer'
  title = 'Mixer'
  active: boolean = false
  node: MixerNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new MixerNode(context)
    this.container = new SynthModule(canvas, Mixer.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentAudioPath)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentAudioPath)
      this.outputs.push({
        type: output.type,
        node: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setAudio('1'), Colors.AccentAudioPath))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setAudio('2'), Colors.AccentAudioPath))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setAudio('3'), Colors.AccentAudioPath))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[3], this.node.setAudio('4'), Colors.AccentAudioPath))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[4], this.node.setAudio('out'), Colors.AccentAudioPath))
  }

  private getOutputConnection(type: string) {
    switch (type) {
      case 'audioOut':
        return this.node.output()
    }
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'audioIn1':
        return this.node.input('1')
      case 'audioIn2':
        return this.node.input('2')
      case 'audioIn3':
        return this.node.input('3')
      case 'audioIn4':
        return this.node.input('4')
    }
  }

  getNode() {
    return this.node
  }
}