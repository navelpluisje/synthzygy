import { GateNode } from '@nodes/gateNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleOutput } from '@components/moduleOutput';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { SynthModuleTriggerButton } from '@components/moduleTriggerButton';

export interface GateTrigger extends Module{
  getNode(): GateNode
}

export class GateTrigger extends ModuleBase implements GateTrigger, ParentModule {
  type =  'gateTrigger'
  title = 'Gate'
  dimensions: DimensionType = {
    height: 130,
    width: 100,
  }
  node: GateNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new GateNode()
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addControls()
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentUtility)
      this.outputs.push({
        type: output.icon,
        node: this.node,
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleTriggerButton(
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