import { ModuleBase } from '../../moduleBase';
import { RandomSequencerNode } from '@nodes/randomSequencerNode'
import { SynthModule, InputConnector, OutputConnector, Rotary, ButtonGroup } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { GateNode } from '@nodes/gateNode';

export class RandomSequencer extends ModuleBase implements ParentModule {
  static dimensions = {
    height: 230,
    width: 190,
  }
  static pulsDimensions = {
    height: 200,
    width: 90,
  }

  type =  'turinger'
  title =  'Turing Machine'
  active: boolean = false
  node: RandomSequencerNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new RandomSequencerNode(context)
    this.container = new SynthModule(canvas, RandomSequencer.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
  }

  private addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentUtility)
      const key = input.type === 'gate' ? 'gate' : 'node'
      this.inputs.push({
        type: input.type,
        [key]: this.getInputConnection(input.name),
        component,
      })
    })
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      const key = output.type === 'gate' ? 'gate' : 'node'
      this.outputs.push({
        type: output.type,
        [key]: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  private addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setProbability, Colors.AccentUtility))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setLength, Colors.AccentUtility))
  }

  private getOutputConnection(type: string): ConstantSourceNode | GateNode {
    switch (type) {
      case 'Out':
        return this.node.output()
      case 'Trigger':
        return this.node.outputGate()
      case '2':
      case '4':
      case '6':
      case '8':
      case '2+4':
      case '2+6':
        return this.node.outputPulse(type)
      }
  }

  private getInputConnection(type: string): Function {
    switch (type) {
      case 'Clock':
        return this.node.inputClock()
    }
  }

  public getNode() {
    return this.node
  }
}