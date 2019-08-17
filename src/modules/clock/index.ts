import { ClockNode } from '@nodes/clockNode'
import { SynthModule, OutputConnector, Rotary } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Clock extends Module{
  getNode(): ClockNode
}

export class Clock extends ModuleBase implements Clock, ParentModule {
  static dimensions: DimensionType = {
    height: 130,
    width: 100,
  }

  type = 'clock'
  title = 'Clock'
  node: ClockNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new ClockNode(context)
    this.container = new SynthModule(canvas, Clock.dimensions, position, this.color)
    this.addOutputs()
    this.addControls()
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      this.outputs.push({
        type: output.type,
        gate: this.node,
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentEffect))
    }

  getNode() {
    return this.node
  }
}