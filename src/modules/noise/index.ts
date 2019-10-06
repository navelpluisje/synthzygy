import { SynthModule, OutputConnector, Rotary } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { NoisesNode } from './noise.node'
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export class Noise extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 230,
    width: 110,
  }

  type =  'noise'
  title = 'Noise'
  node: NoisesNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new NoisesNode(context)
    this.container = new SynthModule(canvas, Noise.dimensions, position, this.color)
    this.setup()
  }

  private async setup() {
    await this.node.setup()
    this.addOutputs()
    this.addControls()
    this.drawOutputs()
    this.drawControls()
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

  private drawOutputs() {
    this.outputs.forEach(output => output.component.draw())
  }

  private addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setPinkNoisGain, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setWhiteNoisGain, Colors.AccentGenerator))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setBlueNoisGain, Colors.AccentGenerator))
  }

  private drawControls() {
    this.controls.forEach(control => control.draw())
  }

  private getOutputConnection(type: string): GainNode {
    switch (type) {
      case 'Pink':
        return this.node.outputPinkNoise()
      case 'White':
        return this.node.outputWhiteNoise()
      case 'Blue':
        return this.node.outputBlueNoise()
    }
  }

  getNode() {
    return this.node
  }
}
