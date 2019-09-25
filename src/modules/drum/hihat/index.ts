import { HiHatNode } from '@nodes/hihatNode'
import { SynthModule, OutputConnector, Rotary, InputConnector } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export class HiHat extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 230,
    width: 110,
  }

  type =  'hihat'
  title = 'Hihat'
  node: HiHatNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new HiHatNode(context)
    this.container = new SynthModule(canvas, HiHat.dimensions, position, this.color)
    this.addInputs()
    this.addOutputs()
    this.addControls()
  }

  private addInputs() {
    inputTypes.forEach((input) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentGenerator)
      this.inputs.push({
        type: input.type,
        gate: this.getInputConnection(input.name),
        component,
      })
    })
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentGenerator)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  private addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setDecay, Colors.AccentGenerator))
  }

  private getInputConnection(type: string): Function {
    switch (type) {
      case 'Gate':
        return this.node.inputGate()
    }
  }

  getNode() {
    return this.node
  }
}
