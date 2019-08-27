import { ModuleBase } from '../moduleBase';
import { EnvelopeNode } from '@nodes/envelopeNode'
import { SynthModule, InputConnector, OutputConnector, Rotary } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Envelope extends Module {
  getNode(): EnvelopeNode
}

export class Envelope extends ModuleBase implements Envelope, ParentModule {
  static dimensions = {
    height: 210,
    width: 200,
  }

  type = 'envelope'
  title = 'Envelope'
  active: boolean = false
  node: EnvelopeNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new EnvelopeNode(context)
    this.container = new SynthModule(canvas, Envelope.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentModulator)
      this.inputs.push({
        type: input.type,
        gate: this.node.inputGate(),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentModulator)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setAttack, Colors.AccentModulator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setDecay, Colors.AccentModulator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setSustain, Colors.AccentModulator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[3], this.node.setRelease, Colors.AccentModulator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[4], this.node.setLevel, Colors.AccentModulator))
  }

  getNode() {
    return this.node
  }
}