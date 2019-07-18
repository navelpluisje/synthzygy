import { JsLfoNode, IJsLfoNode } from '@nodes/lfoNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType, ControlType, DimensionType } from '../types';
import { colors, CONTROL_ROTARY, LARGE_KNOB } from '../constants';
import { IParentModule, IModule } from '@interfaces/index';
import { ModuleBase } from './moduleBase';

export interface ILfo extends IModule{
  getNode(): IJsLfoNode
}

export class Lfo extends ModuleBase implements ILfo, IParentModule {
  static outputTypes = ['saw', 'square', 'sine', 'triangle']
  static controlTypes: Array<ControlType> = [{
    type: CONTROL_ROTARY,
    label: 'Freq',
    size: LARGE_KNOB,
    min: 0,
    max: 15,
    step: .01,
    log: true,
    value: 0,
    position: {
      x: 60,
      y: 75,
    }
  }]

  type =  'lfo'
  title = 'Lfo'
  color = colors.yellow
  dimensions: DimensionType = {
    height: 160,
    width: 160,
  }
  node: IJsLfoNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new JsLfoNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addControls()
  }

  addOutputs() {
    Lfo.outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, Lfo.outputTypes.length - index - 1, output)
      this.outputs.push({
        type: output,
        node: this.getOutputConnection(output),
        component,
      })
    })
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, Lfo.controlTypes[0], this.node.setFrequency))
  }

  private getOutputConnection(type: string): OscillatorNode | GainNode {
    switch (type) {
      case 'saw':
        return this.node.outputSaw()
      case 'sine':
        return this.node.outputSine()
      case 'square':
        return this.node.outputSquare()
      case 'triangle':
        return this.node.outputTriangle()
    }
  }

  getNode() {
    return this.node
  }
}