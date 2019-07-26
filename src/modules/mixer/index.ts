import { ModuleBase } from '../moduleBase';
import { MixerNode } from '@nodes/mixerNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Mixer extends Module {
  getNode(): MixerNode
}

export class Mixer extends ModuleBase implements Mixer, ParentModule {
  type = 'mixer'
  title = 'Mixer'
  dimensions = {
    height: 245,
    width: 165,
  }
  active: boolean = false
  node: MixerNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new MixerNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, input, Colors.AccentAudioPath)
      this.inputs.push({
        type: input.icon,
        node: this.getInputConnection(input.icon),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentAudioPath)
      this.outputs.push({
        type: output.icon,
        node: this.getOutputConnection(output.icon),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setAudio('1'), Colors.AccentAudioPath))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[1], this.node.setAudio('2'), Colors.AccentAudioPath))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[2], this.node.setAudio('3'), Colors.AccentAudioPath))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[3], this.node.setAudio('4'), Colors.AccentAudioPath))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[4], this.node.setAudio('out'), Colors.AccentAudioPath))
  }

  private getOutputConnection(type: string) {
    switch (type) {
      case 'audio-out':
        return this.node.outputAudio()
    }
  }

  private getInputConnection(type: string): AudioParam | GainNode {
    switch (type) {
      case 'audio-in-1':
        return this.node.connectInput('1')
      case 'audio-in-2':
        return this.node.connectInput('2')
      case 'audio-in-3':
        return this.node.connectInput('3')
      case 'audio-in-4':
        return this.node.connectInput('4')
    }
  }

  getNode() {
    return this.node
  }
}