import { ModuleBase } from '../moduleBase';
import { SynthModule, InputConnector, OutputConnector, Rotary, ButtonGroup } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { JsOscillatorNode } from './oscillator.node'
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { buttons } from './buttons';

export class Oscillator extends ModuleBase implements ParentModule {
  static dimensions = {
    height: 230,
    width: 190,
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
    this.addButtonControls()
    this.addControls()
  }

  private addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentGenerator)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentGenerator)
      this.outputs.push({
        type: output.type,
        node: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  private addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setOctave, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setFm, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[3], this.node.setDetune, Colors.AccentGenerator))
  }

  addButtonControls() {
    buttons.forEach(buttonGroup => {
      this.buttons.push(new ButtonGroup(this.canvas, this, buttonGroup, this.node.setRange, Colors.AccentGenerator, true))
    })
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

  private getInputConnection(type: string): AudioParam | GainNode | AudioWorkletNode{
    switch (type) {
      case 'fm':
        return this.node.inputCvFM()
      case 'frequency':
        return this.node.inputCvFrequency()
    }
  }

  public getNode() {
    return this.node
  }
}