import { ClockNode } from '@nodes/clockNode'
import { SynthModule, OutputConnector, Rotary } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';

export class Clock extends ModuleBase implements Clock, ParentModule {
  static dimensions: DimensionType = {
    height: 210,
    width: 140,
  }

  bpm: number = 120
  frequency: number = 2
  pulseWidth: number = .5
  type = 'clock'
  title = 'Clock'
  context: AudioContext
  nodes: Record<string, ClockNode> = {}

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.context = context
    this.container = new SynthModule(canvas, Clock.dimensions, position, this.color)
    this.createNodes()
    this.addOutputs()
    this.addControls()
  }

  private createNodes() {
    this.nodes['2'] = new ClockNode(this.context)
    this.nodes['/1'] = new ClockNode(this.context)
    this.nodes['/2'] = new ClockNode(this.context)
    this.nodes['/4'] = new ClockNode(this.context)
    this.nodes['/8'] = new ClockNode(this.context)
    this.setBPM(this.bpm)
    this.setPulseWidth(this.pulseWidth)
  }

  private addOutputs(): void {
    console.log(this.nodes)
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      console.log(this.nodes)
      this.outputs.push({
        type: output.type,
        gate: this.nodes[output.name],
        component,
      })
    })
  }

  private addControls(): void {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.setBPM, Colors.AccentUtility))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.setPulseWidth, Colors.AccentUtility))
  }

  draw = (): void => {
    super.draw()
    this.drawBPMDisplay()
  }

  private setBPM = (bpm: number): void => {
    this.bpm = bpm
    this.frequency = bpm / 60

    Object.values(this.nodes).forEach((node, index) => {
      const value = this.frequency * (2 ** (index - 1))
      node.setFrequency(value)
    })

    this.drawBPMDisplay(true)
  }

  private setPulseWidth(pw: number) {
    this.pulseWidth = pw
    Object.values(this.nodes).forEach(node => node.setPulseWidth(this.pulseWidth))
  }

  private drawBPMDisplay(reset: boolean = false): void {
    const { x, y } = this.getPosition()
    const xPos = x + 20
    const yPos = y + 45
    const width = 50
    const height = 20

    if (reset) {
      this.canvas.save()
      this.canvas.strokeStyle = Colors.ModuleBackground
      this.canvas.fillStyle = Colors.ModuleBackground
      this.canvas.beginPath()
      this.canvas.rect(xPos, yPos, width, height)
      this.canvas.fill()
      this.canvas.stroke()
    }

    this.canvas.save()
    this.canvas.font ='16px Raleway, sans-serif'
    this.canvas.strokeStyle = Colors.AccentUtility
    this.canvas.fillStyle = 'transparent'
    this.canvas.beginPath()
    this.canvas.rect(xPos, yPos, width, height)
    this.canvas.fill()
    this.canvas.stroke()

    this.canvas.beginPath()
    this.canvas.fillStyle = Colors.AccentUtility
    this.canvas.shadowOffsetX = .5
    this.canvas.shadowOffsetY = .5
    this.canvas.shadowBlur = 1
    this.canvas.shadowColor = Colors.ModuleBackground
    this.canvas.fillText(this.bpm.toFixed(1), xPos + width / 2, yPos + height / 2)
    this.canvas.restore()

  }

  public getNode() {
    return this.nodes['/1']
  }
}