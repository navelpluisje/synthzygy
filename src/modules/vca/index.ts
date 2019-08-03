import { ModuleBase } from '../moduleBase';
import { VcaNode } from '@nodes/vcaNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType } from '../../types';
import { Colors } from '../../constants';
import { ParentModule, Module } from '@interfaces/index';
import { controlTypes } from './controls';
import { outputTypes } from './outputs';
import { inputTypes } from './inputs';

export interface Vca extends Module {
  getNode(): VcaNode
}

export class Vca extends ModuleBase implements Vca, ParentModule {
  type = 'vca'
  title = 'Vca'
  dimensions = {
    height: 140,
    width: 130,
  }
  active: boolean = false
  node: VcaNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new VcaNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  getKey(type: string): string {
    switch (type) {
      case 'audio':
        return 'node'
      case 'cv':
        return 'cv'
    }
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, input, Colors.AccentAudioPath)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentAudioPath)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath))
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'cvGain':
        return this.node.inputCvGain()
      case 'audioIn':
        return this.node.input()
    }
  }

  getNode() {
    return this.node
  }
}