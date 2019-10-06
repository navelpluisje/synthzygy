import { ModuleBase } from '../moduleBase';
import { SynthModule, InputConnector, OutputConnector, Rotary } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { DelayerNode } from './delay.node'
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

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
      const component = new InputConnector(this.canvas, this, input, Colors.AccentEffect)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach(output => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentEffect)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setDelayTime, Colors.AccentEffect))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setFeedback, Colors.AccentEffect))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setDryWet, Colors.AccentEffect))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[3], this.node.setFrequency, Colors.AccentEffect))
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