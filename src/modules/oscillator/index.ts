import { ModuleBase } from '../moduleBase';
import { JsOscillatorNode } from '@nodes/oscillatorNode'
import { SynthModule, InputConnector, OutputConnector, Rotary } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Oscillator extends Module {
  getNode(): JsOscillatorNode
}

export class Oscillator extends ModuleBase implements Oscillator, ParentModule {
  static dimensions = {
    height: 190,
    width: 180,
  }

  type =  'oscillator'
  title =  'Oscillator'
  active: boolean = false
  node: JsOscillatorNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new JsOscillatorNode(context)
    this.container = new SynthModule(canvas, Oscillator.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentGenerator)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentGenerator)
      this.outputs.push({
        type: output.type,
        node: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setOctave, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setFm, Colors.AccentGenerator))
  }

  private getOutputConnection(type: string): GainNode {
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