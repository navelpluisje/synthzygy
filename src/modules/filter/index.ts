import { ModuleBase } from '../moduleBase';
import { FilterNode } from '@nodes/filterNode'
import { SynthModule } from '@components/synthModule';
import { SynthModuleInput } from '@components/moduleInput';
import { SynthModuleOutput } from '@components/moduleOutput';
import { SynthModuleRotary } from '@components/moduleRotary';
import { PositionType } from '../../types';
import { Colors } from '../../constants';
import { ParentModule, Module } from '@interfaces/index';
import { buttons } from './buttons'
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { SynthModuleButtonGroup } from '@components/moduleButtonGroup';

export interface Filter extends Module {
  getNode(): FilterNode
}

export class Filter extends ModuleBase implements Filter, ParentModule {
  type = 'filter'
  title = 'Filter'
  dimensions = {
    height: 290,
    width: 170,
  }
  active: boolean = false
  node: FilterNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new FilterNode(context)
    this.container = new SynthModule(canvas, this.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
    this.addButtonControls()
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
    outputTypes.forEach((output, index) => {
      const component = new SynthModuleOutput(this.canvas, this, output, Colors.AccentEffect)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addButtonControls() {
    this.buttons.push(new SynthModuleButtonGroup(this.canvas, this, buttons, this.node.setFilterType, Colors.AccentEffect))
  }

  addControls() {
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[2], this.node.setQ, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[1], this.node.setInputLevel, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[3], this.node.setCvFrequency, Colors.AccentEffect))
    this.controls.push(new SynthModuleRotary(this.canvas, this, controlTypes[4], this.node.SetCvQ, Colors.AccentEffect))
  }

  private getInputConnection(type: string): GainNode | BiquadFilterNode {
    switch (type) {
      case 'cvFreq':
        return this.node.inputCvFrequency()
      case 'cvQ':
        return this.node.inputCvQ()
      case 'audioIn':
        return this.node.input()
    }

  }

  getNode(): FilterNode {
    return this.node
  }
}