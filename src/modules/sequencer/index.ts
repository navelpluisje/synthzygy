import { ModuleBase } from '../moduleBase';
import { SequencerNode } from '@nodes/sequencerNode'
import { SynthModule, InputConnector, OutputConnector, Rotary, ButtonGroup, ThreeStateButton } from '@components/index';
import { PositionType, ControlType } from 'src/types';
import { Colors, SMALL_KNOB } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { buttons } from './buttons'
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { GateNode } from '@nodes/gateNode';

export interface Sequencer extends Module {
  getNode(): SequencerNode
}

export class Sequencer extends ModuleBase implements Sequencer, ParentModule {
  static dimensions = {
    height: 170,
    width: 570,
  }

  type = 'sequencer'
  title = 'Sequencer'
  active: boolean = false
  activeControlGroup: 'A' | 'B' = 'A'
  node: SequencerNode
  stepButtons: ThreeStateButton[] = []

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new SequencerNode(context, this.onStepChange)
    this.container = new SynthModule(canvas, Sequencer.dimensions, position, this.color)
    this.draw.bind(this)
    this.addOutputs()
    this.addInputs()
    this.addControls()
    this.addButtonControls()
    this.addStepButtons()
  }

  draw = (): void => {
    super.draw()
    this.drawStepButtons()
  }

  private addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentUtility)
      this.inputs.push({
        type: input.type,
        gate: this.node.inputGate(),
        component,
      })
    })
  }

  private addOutputs() {
    outputTypes.forEach(output => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      const key = output.type === 'gate' ? 'gate' : 'node'
      this.outputs.push({
        type: output.type,
        [key]: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  private getOutputConnection(type: string): GateNode | AudioWorkletNode {
    switch (type) {
      case 'cv A':
        return this.node.outputA()
      case 'cv B':
        return this.node.outputB()
      case 'gateOut':
        return this.node.outputGate()
    }
  }

  private addButtonControls() {
    this.buttons.push(new ButtonGroup(this.canvas, this, buttons[0], this.node.handleTransportClick, Colors.AccentUtility))
    this.buttons.push(new ButtonGroup(this.canvas, this, buttons[1], this.onRestButtonClick, Colors.AccentUtility))
    this.buttons.push(new ButtonGroup(this.canvas, this, buttons[2], this.handleGroupClick, Colors.AccentUtility))
  }

  private onRestButtonClick = () => {
    this.buttons[1].setActiveButton('xx')
    this.node.reset()
  }

  public handleGroupClick = (group: 'A' | 'B') => {
    this.activeControlGroup = group
    const stepValues: Float32Array = this.node.getStepValues(group)
    this.controls.forEach((control, index) => control.setValue(stepValues[index]))
    this.draw()
  }

  onMouseDown(event: MouseEvent): boolean {
    super.onMouseDown(event)

    if (!this.active) {
      return false
    }
    const {offsetX: xPos, offsetY: yPos} = event
    this.offset = {
      x: xPos - this.position.x,
      y: yPos - this.position.y,
    }

    this.stepButtons.some(stepButton => {
      const position = stepButton.isControlClicked(xPos, yPos)
      if (position) {
        // this.activeOutput = o
        this.drawStepButtons(true)
        return true
      }
    })
    return true
  }

  private addStepButtons() {
    for (let i = 0; i < 16; i += 1) {
      const button: ControlType = {
        type: 'stepButton',
        size: SMALL_KNOB,
        position: {
          x: 90 + i * 22.5,
          y: 150,
        },
    }
      this.stepButtons.push(new ThreeStateButton(
        this.canvas,
        this,
        button,
        this.setGateValue(i),
        Colors.AccentUtility
      ))
    }
  }

  private onStepChange = (step: number) => {
    this.stepButtons.forEach((button, index) => {
      button.setActiveStep(step === index)
      button.draw(true)
    })
  }

  private setGateValue = (index: number) => (value: boolean) => {
    this.node.setGateStep(index, value)
  }

  private drawStepButtons(overWrite = false): void {
    this.stepButtons.forEach(button => button.draw(overWrite))
  }

  private setStepValue = (index: number) => (value: number) => {
    this.node.setStepAValue(index, this.activeControlGroup, value)
  }

  private addControls() {
    for (let i = 0; i < 16; i += 1) {
      this.controls.push(new Rotary(this.canvas, this, controlTypes[i], this.setStepValue(i), Colors.AccentUtility))
    }
  }

  public getNode(): SequencerNode {
    return this.node
  }
}