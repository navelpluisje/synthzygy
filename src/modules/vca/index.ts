import { ModuleBase } from '../moduleBase'
import { SynthModule, InputConnector, OutputConnector, Rotary } from '@components/index'
import { PositionType } from 'src/types'
import { Colors } from 'src/constants/enums'
import { ParentModule, Module } from '@interfaces/index'
import { controlTypes } from './controls'
import { VcaNode } from './vca.node'
import { outputTypes } from './outputs'
import { inputTypes } from './inputs'

export interface Vca extends Module {
  getNode(): VcaNode
}

export class Vca extends ModuleBase implements Vca, ParentModule {
  static dimensions = {
    height: 140,
    width: 130,
  }

  type = 'vca'
  title = 'Vca'
  active: boolean = false
  node: VcaNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new VcaNode(context)
    this.container = new SynthModule(canvas, Vca.dimensions, position, this.color)
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
      const component = new InputConnector(this.canvas, this, input, Colors.AccentAudioPath)
      this.inputs.push({
        type: input.type,
        node: this.getInputConnection(input.name),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentAudioPath)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath))
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