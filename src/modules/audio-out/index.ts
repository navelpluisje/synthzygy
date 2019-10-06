import { InputConnector, Rotary, SynthModule } from '@components/index';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { OutputNode } from './output.node'
import { controlTypes } from './controls';
import { inputTypes } from './inputs';

export class AudioOut extends ModuleBase implements ParentModule {
  static dimensions = {
    height: 155,
    width: 120,
  }

  type = 'audioOut'
  title = 'Output'
  active: boolean = false
  private node: OutputNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new OutputNode(context)
    this.container = new SynthModule(canvas, AudioOut.dimensions, position, this.color)
    this.addInputs()
    this.addControls()
  }

  private addInputs(): void {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentAudioPath)
      this.inputs.push({
        type: input.type,
        node: this.node.connectAudioIn(),
        component,
      })
    })
  }

  private addControls(): void {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath))
  }

  public getNode(): OutputNode {
    return this.node
  }
}