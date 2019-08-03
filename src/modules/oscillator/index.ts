import { ModuleBase } from '../moduleBase';
import { JsOscillatorNode } from '@nodes/oscillatorNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType } from '../../types';
import { Colors } from '../../constants';
import { ParentModule, Module } from '@interfaces/index';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Oscillator extends Module {
  getNode(): JsOscillatorNode
}

export class Oscillator extends ModuleBase implements Oscillator, ParentModule {
  type =  'oscillator'
  title =  'Oscillator'
  dimensions = {
    height: 190,
    width: 180,
  }
  active: boolean = false
  node: JsOscillatorNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new JsOscillatorNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, input, Colors.AccentGenerator)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentGenerator)
      this.outputs.push({
        type: output.type,
        node: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentGenerator))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[1], this.node.setOctave, Colors.AccentGenerator))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[2], this.node.setFm, Colors.AccentGenerator))
  }

  private getOutputConnection(type: string): GainNode | OscillatorNode {
    switch (type) {
      case 'sawWave':
        return this.node.outputSaw()
      case 'sineWave':
        return this.node.outputSine()
      case 'squareWave':
        return this.node.outputSquare()
      case 'triangleWave':
        return this.node.outputTriangle()
    }
  }

  private getInputConnection(type: string): AudioParam | GainNode {
    switch (type) {
      case 'fm':
        return this.node.inputCvFM()
      case 'frequency':
        return this.node.inputCvFrequency()
    }
  }

  getNode() {
    return this.node
  }
}