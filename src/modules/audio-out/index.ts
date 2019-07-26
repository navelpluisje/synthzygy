import { ModuleBase } from '../moduleBase';
import { OutputNode } from '@nodes/outputNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType } from '../../types';
import { Colors } from '../../constants';
import { ParentModule, Module } from '@interfaces/index';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';

export interface AudioOut extends Module {
  getNode(): OutputNode
}

export class AudioOut extends ModuleBase implements AudioOut, ParentModule {
  type = 'audioOut'
  title = 'Output'
  dimensions = {
    height: 155,
    width: 120,
  }
  active: boolean = false
  node: OutputNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new OutputNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new SynthModuleInput(this.canvas, this, input, Colors.AccentUtility)
      this.inputs.push({
        type: input.icon,
        node: this.getInputConnection(input.icon),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentUtility))
  }

  private getInputConnection(type: string): AudioParam | GainNode {
    switch (type) {
      case 'gate':
        return this.node.connectGate()
      case 'audio-in':
        return this.node.connectAudioIn()
    }
  }

  getNode() {
    return this.node
  }
}