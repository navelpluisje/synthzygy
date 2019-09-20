import { InputConnector, Rotary, SynthModule } from '@components/index';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { OutputNode } from '@nodes/outputNode'
import { PositionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';

export interface AudioOut extends Module {
  getNode(): OutputNode
}

export class AudioOut extends ModuleBase implements AudioOut, ParentModule {
  static dimensions = {
    height: 155,
    width: 120,
  }

  type = 'audioOut'
  title = 'Output'
  active: boolean = false
  node: OutputNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new OutputNode(context)
    this.container = new SynthModule(canvas, AudioOut.dimensions, position, this.color)
    this.addInputs()
    this.addControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentAudioPath)
      this.inputs.push({
        type: input.type,
        node: this.node.connectAudioIn(),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath))
  }

  getNode() {
    return this.node
  }
}