import { ModuleBase } from './moduleBase';
import { MixerNode } from '@nodes/mixerNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType, ControlType } from '../types';
import { colors, CONTROL_ROTARY, LARGE_KNOB, MEDIUM_KNOB } from '../constants';
import { ParentModule, Module } from '@interfaces/index';

export interface Mixer extends Module {
  getNode(): MixerNode
}

export class Mixer extends ModuleBase implements Mixer, ParentModule {
  static inputTypes = ['audio-in-1', 'audio-in-2', 'audio-in-3', 'audio-in-4']
  static outputTypes = ['audio-out']
  static controlTypes: Array<ControlType> = [{
    type: CONTROL_ROTARY,
    label: 'In 1',
    size: LARGE_KNOB,
    min: 0,
    max: 1,
    step: .01,
    value: .5,
    position: {
      x: 80,
      y: 75,
    }
  }, {
    type: CONTROL_ROTARY,
    label: 'In 2',
    size: LARGE_KNOB,
    min: 0,
    max: 1,
    step: .01,
    value: .5,
    position: {
      x: 150,
      y: 75,
    }
  }, {
    type: CONTROL_ROTARY,
    label: 'In 3',
    size: LARGE_KNOB,
    min: 0,
    max: 1,
    step: .01,
    value: .5,
    position: {
      x: 80,
      y: 160,
    }
  }, {
    type: CONTROL_ROTARY,
    label: 'In 4',
    size: LARGE_KNOB,
    min: 0,
    max: 1,
    step: .01,
    value: .5,
    position: {
      x: 150,
      y: 160,
    }
  }, {
    type: CONTROL_ROTARY,
    label: 'Out',
    size: MEDIUM_KNOB,
    min: 0,
    max: 1,
    step: .01,
    log: false,
    value: .5,
    position: {
      x: 115,
      y: 245,
    }
  }]

  type = 'mixer'
  title = 'Mixer'
  color = colors.pink
  dimensions = {
    height: 310,
    width: 200,
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
    Mixer.inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, Mixer.inputTypes.length - index - 1, input)
      this.inputs.push({
        type: input,
        node: this.getInputConnection(input),
        component,
      })
    })
  }

  addOutputs() {
    Mixer.outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, Mixer.outputTypes.length - index - 1, output)
      this.outputs.push({
        type: output,
        node: this.getOutputConnection(output),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, Mixer.controlTypes[0], this.node.setAudio('1')))
    this.controls.push(new SynthModuleRotary(this.canvas, this, Mixer.controlTypes[1], this.node.setAudio('2')))
    this.controls.push(new SynthModuleRotary(this.canvas, this, Mixer.controlTypes[2], this.node.setAudio('3')))
    this.controls.push(new SynthModuleRotary(this.canvas, this, Mixer.controlTypes[3], this.node.setAudio('4')))
    this.controls.push(new SynthModuleRotary(this.canvas, this, Mixer.controlTypes[4], this.node.setAudio('out')))
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