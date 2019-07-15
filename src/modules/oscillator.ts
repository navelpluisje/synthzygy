import { ModuleBase } from './moduleBase';
import { JsOscillatorNode, IJsOscillatorNode } from '@nodes/oscillatorNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType, ControlType, ActiveOutputType } from '../types';
import { colors, CONTROL_ROTARY, LARGE_KNOB, STEP_ROTARY, MEDIUM_KNOB } from '../constants';
import { IParentModule, IModule } from '@interfaces/index';

export type IOscillator = IModule & {
  getNode(): IJsOscillatorNode
}

export class Oscillator extends ModuleBase implements IOscillator, IParentModule {
  static inputTypes = ['fm', 'frequency']
  static outputTypes = ['saw', 'square', 'sine', 'triangle']
  static controlTypes: Array<ControlType> = [{
    type: CONTROL_ROTARY,
    label: 'Freq',
    size: LARGE_KNOB,
    min: 10,
    max: 134,
    step: 1,
    log: true,
    value: 440,
    position: {
      x: 100,
      y: 75,
    }
  }, {
    type: STEP_ROTARY,
    label: 'Range',
    size: LARGE_KNOB,
    position: {
      x: 100,
      y: 160,
    },
    min: -2,
    max: 2,
    step: 1,
    value: 0,
  }, {
    type: CONTROL_ROTARY,
    label: 'FM',
    size: MEDIUM_KNOB,
    min: 0,
    max: 20,
    step: .1,
    value: 0,
    position: {
      x: 40,
      y: 100,
    }
  }]

  type =  'oscillator'
  color = colors.yellow
  dimensions = {
    height: 230,
    width: 200,
  }
  active: boolean = false
  node: IJsOscillatorNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new JsOscillatorNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    Oscillator.inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, Oscillator.inputTypes.length - index, input)
      this.inputs.push({
        type: input,
        node: this.getInputConnection(input),
        component,
      })
    })
  }

  addOutputs() {
    Oscillator.outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, Oscillator.outputTypes.length - index, output)
      this.outputs.push({
        type: output,
        node: this.getOutputConnection(output),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, Oscillator.controlTypes[0], this.node.setFrequency))
    this.controls.push(new SynthModuleRotary(this.canvas, this, Oscillator.controlTypes[1], this.node.setOctave))
    this.controls.push(new SynthModuleRotary(this.canvas, this, Oscillator.controlTypes[2], this.node.setFm))
  }

  private getOutputConnection(type: string) {
    switch (type) {
      case 'saw':
        return this.node.outputSaw()
      case 'sine':
        return this.node.outputSine()
      case 'square':
        return this.node.outputSquare()
      case 'triangle':
        return this.node.outputTriangle()
    }
  }

  private getInputConnection(type: string): AudioParam | GainNode {
    switch (type) {
      case 'fm':
        return this.node.connectFM()
      case 'frequency':
        return this.node.connectFrequency()
    }
  }

  getNode() {
    return this.node
  }
}