import { ModuleBase } from '../moduleBase';
import { BitCrusherNode } from '@nodes/bitCrusherNode'
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

export interface BitCrusher extends Module {
  getNode(): BitCrusherNode
}

export class BitCrusher extends ModuleBase implements BitCrusher, ParentModule {
  static dimensions = {
    height: 145,
    width: 140,
  }

  type = 'bitCrusher'
  title = 'Crushy'
  active: boolean = false
  node: BitCrusherNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new BitCrusherNode(context)
    this.container = new SynthModule(canvas, BitCrusher.dimensions, position, this.color)
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
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setBitDepth, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[1], this.node.setFrequencyReduction, Colors.AccentEffect))
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'audioIn':
        return this.node.input()
    }

  }

  getNode(): BitCrusherNode {
    return this.node
  }
}