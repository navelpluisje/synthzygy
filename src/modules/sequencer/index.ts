import { ModuleBase } from '../moduleBase';
import { FilterNode } from '@nodes/filterNode'
import { SynthModule, InputConnector, OutputConnector, Rotary, ButtonGroup } from '@components/index';
import { PositionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { buttons } from './buttons'
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export interface Sequencer extends Module {
  getNode(): FilterNode
}

export class Sequencer extends ModuleBase implements Sequencer, ParentModule {
  static dimensions = {
    height: 170,
    width: 570,
  }

  type = 'sequencer'
  title = 'Sequencer'
  active: boolean = false
  node: FilterNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new FilterNode(context)
    this.container = new SynthModule(canvas, Sequencer.dimensions, position, this.color)
    this.addOutputs()
    this.addInputs()
    this.addControls()
    this.addButtonControls()
  }

  addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentUtility)
      this.inputs.push({
        type: input.type,
        gate: null, // this.node.inputGate(),
        component,
      })
    })
  }

  addOutputs() {
    outputTypes.forEach(output => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      this.outputs.push({
        type: output.type,
        node: this.node.output(),
        component,
      })
    })
  }

  addButtonControls() {
    buttons.forEach(buttonGroup => {
      this.buttons.push(new ButtonGroup(this.canvas, this, buttonGroup, this.node.setFilterType, Colors.AccentUtility))
    })
  }

  addControls() {
    for (let i = 0; i < 16; i += 1) {
      this.controls.push(new Rotary(this.canvas, this, controlTypes[i], null, Colors.AccentUtility))
    }
  }

  getNode(): FilterNode {
    return this.node
  }
}