import { TriggerButton, SynthModule, OutputConnector } from '@components/index';
import { GateNode } from '@nodes/gateNode'
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface GateTrigger extends Module{
  getNode(): GateNode
}

export class GateTrigger extends ModuleBase implements GateTrigger, ParentModule {
  static dimensions: DimensionType = {
    height: 130,
    width: 100,
  }

  type =  'gateTrigger'
  title = 'Gate'
  node: GateNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new GateNode()
    this.container = new SynthModule(canvas, GateTrigger.dimensions, position, this.color)
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
    this.controls.push(new TriggerButton(
      this.canvas,
      this,
      controlTypes[0],
      this.node.onKeyDown,
      this.node.onKeyUp,
      Colors.AccentUtility,
    ))
  }

  getNode() {
    return this.node
  }
}