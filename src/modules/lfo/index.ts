import { LfoNode } from '@nodes/lfoNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType, ControlType, DimensionType } from '../../types';
import { Colors, CONTROL_ROTARY, MEDIUM_KNOB } from '../../constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Lfo extends Module{
  getNode(): LfoNode
}

export class Lfo extends ModuleBase implements Lfo, ParentModule {
  type =  'lfo'
  title = 'Lfo'
  dimensions: DimensionType = {
    height: 160,
    width: 130,
  }
  node: LfoNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new LfoNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addControls()
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentModulator)
      this.outputs.push({
        type: output.type,
        node: this.getOutputConnection(output.icon),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentModulator))
  }

  private getOutputConnection(type: string): OscillatorNode | GainNode {
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