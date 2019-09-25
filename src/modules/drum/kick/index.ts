import { KickNode } from '@nodes/kickNode'
import { SynthModule, OutputConnector, Rotary, InputConnector } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export class Kick extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 140,
    width: 140,
  }

  type =  'kick'
  title = 'Kick'
  node: KickNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new KickNode(context)
    this.container = new SynthModule(canvas, Kick.dimensions, position, this.color)
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
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFequency, Colors.AccentGenerator))
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
