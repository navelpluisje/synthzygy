import { SnareNode } from '@nodes/snareNode'
import { SynthModule, OutputConnector, Rotary, InputConnector } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
// import { controlTypes } from './controls';

export class Snare extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 230,
    width: 110,
  }

  type =  'snare'
  title = 'Snare'
  node: SnareNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new SnareNode(context)
    this.container = new SynthModule(canvas, Snare.dimensions, position, this.color)
    this.addInputs()
    this.addOutputs()
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

  // private addControls() {
  //   this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setPinkNoisGain, Colors.AccentGenerator))
  //   this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setWhiteNoisGain, Colors.AccentGenerator))
  //   this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setBlueNoisGain, Colors.AccentGenerator))
  // }

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
