import { ModuleBase } from '../moduleBase';
import { EnvelopeNode } from '@nodes/envelopeNode'
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

export interface Envelope extends Module {
  getNode(): EnvelopeNode
}

export class Envelope extends ModuleBase implements Envelope, ParentModule {
  type = 'envelope'
  title = 'Envelope'
  dimensions = {
    height: 210,
    width: 140,
}
  active: boolean = false
  node: EnvelopeNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new EnvelopeNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, input, Colors.AccentEnvelope)
      this.inputs.push({
        type: input.type,
        gate: this.node.connectGate(),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentEnvelope)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setAttack, Colors.AccentEnvelope))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[1], this.node.setDecay, Colors.AccentEnvelope))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[2], this.node.setSustain, Colors.AccentEnvelope))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[3], this.node.setRelease, Colors.AccentEnvelope))
  }

  getNode() {
    return this.node
  }
}