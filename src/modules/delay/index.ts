import { ModuleBase } from '../moduleBase';
import { DelayerNode } from '@nodes/delayNode'
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
import { SynthModuleButtonGroup } from '@components/moduleButtonGroup';

export interface Delay extends Module {
  getNode(): DelayerNode
}

export class Delay extends ModuleBase implements Delay, ParentModule {
  static dimensions = {
    height: 210,
    width: 140,
  }

  type = 'delay'
  title = 'Delay'
  active: boolean = false
  node: DelayerNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new DelayerNode(context)
    this.container = new SynthModule(canvas, Delay.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, input, Colors.AccentEffect)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach(output => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentEffect)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setFeedback, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[1], this.node.setDelayTime, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[2], this.node.setFrequency, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[3], this.node.setDryWet, Colors.AccentEffect))
  }

  private getInputConnection(type: string): GainNode | DelayNode {
    switch (type) {
      case 'audioIn':
        return this.node.input()
    }

  }

  getNode(): DelayerNode {
    return this.node
  }
}