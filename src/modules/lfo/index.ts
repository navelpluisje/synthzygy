import { SynthModule, OutputConnector, Rotary } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { LfoNode } from './lfo.node'
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Lfo extends Module{
  getNode(): LfoNode
}

export class Lfo extends ModuleBase implements Lfo, ParentModule {
  static dimensions: DimensionType = {
    height: 160,
    width: 140,
  }

  type =  'lfo'
  title = 'Lfo'
  node: LfoNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new LfoNode(context)
    this.container = new SynthModule(canvas, Lfo.dimensions, position, this.color)
    this.addOutputs()
    this.addControls()
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentModulator)
      this.outputs.push({
        type: output.type,
        node: this.getOutputConnection(output.icon),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentModulator))
  }

  private getOutputConnection(type: string): GainNode {
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

  getNode() {
    return this.node
  }
}