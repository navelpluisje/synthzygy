import { ModuleBase } from '../moduleBase';
import { SynthModule, InputConnector, OutputConnector, Rotary } from '@components/index';
import { PositionType, SynthConnectorType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';

export class Oscilloscope extends ModuleBase implements ParentModule {
  static dimensions = {
    height: 190,
    width: 445,
  }

  type = 'oscilloscope'
  title = 'Oscilloscope'
  active: boolean = false
  node: AnalyserNode
  bufferLength: number
  dataArray: Float32Array
  verticalSpread: number = .5
  fftSizeBase: number = 32
  fftSizePower: number = 8

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)

    this.node = context.createAnalyser()
    this.setFftSize(this.fftSizePower)
    this.container = new SynthModule(canvas, Oscilloscope.dimensions, position, this.color)
    this.addInputs()
    this.addControls()
    this.drawWave()
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
    const input = inputTypes[0]
    const component = new InputConnector(this.canvas, this, input, Colors.AccentUtility)
    this.inputs.push({
      type: input.type,
      node: this.node,
      component,
    })
  }

  addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.setFftSize, Colors.AccentUtility))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.setVerticalSpread, Colors.AccentUtility))
  }

  setFftSize = (value: number) => {
    this.fftSizePower = value
    this.node.fftSize = this.fftSizeBase * (2 ** this.fftSizePower)
    this.bufferLength = this.node.frequencyBinCount
    this.dataArray = new Float32Array(this.bufferLength)
    requestAnimationFrame(() => this.drawWave())
  }

  setVerticalSpread = (value: number) => {
    this.verticalSpread = value
    requestAnimationFrame(() => this.drawWave())
  }

  drawWave() {
    if (!this.node) {return false}
    const xPos = this.position.x + 45
    const yPos = this.position.y + 45
    const width = 320
    const height = 120
    const spread = 40 * this.verticalSpread

    requestAnimationFrame(() => this.drawWave())
    this.node.getFloatTimeDomainData(this.dataArray)
    this.canvas.fillStyle = "hsl(120, 2%, 28%)"
    this.canvas.strokeStyle = Colors.AccentUtility
    this.canvas.lineWidth = 1
    this.canvas.beginPath()
    this.canvas.rect(xPos, yPos, width, height)
    this.canvas.stroke()
    this.canvas.fill()
    this.canvas.strokeStyle = Colors.ControlBorder

    this.canvas.beginPath()
    this.canvas.lineWidth = 0.25
    this.canvas.moveTo(xPos, yPos + (height / 2))
    this.canvas.lineTo(xPos + width, yPos + (height / 2))
    this.canvas.stroke()

    this.canvas.beginPath()
    this.canvas.lineWidth = 0.25
    this.canvas.moveTo(xPos, yPos + (height / 2) + spread)
    this.canvas.lineTo(xPos + width, yPos + (height / 2) + spread)
    this.canvas.stroke()

    this.canvas.beginPath()
    this.canvas.lineWidth = 0.25
    this.canvas.moveTo(xPos, yPos + (height / 2) - spread)
    this.canvas.lineTo(xPos + width, yPos + (height / 2) - spread)
    this.canvas.stroke()

    this.canvas.lineWidth = 2
    this.canvas.strokeStyle = Colors.AccentUtility
    this.canvas.beginPath()


    const sliceWidth = width / (this.bufferLength / 8)
    let x = 0
    let to = 0
    for (let i = 0; i < (this.bufferLength); i += 8) {
      const v = this.dataArray[i] * -1
      const y = v * spread + (height / 2)
      to = Math.max(Math.min(yPos + height, yPos + y), yPos)
      if (i === 0) {
        this.canvas.moveTo(xPos + x, to)
      } else {
        this.canvas.lineTo(xPos + x, to)
      }
      x += sliceWidth
    }

    this.canvas.lineTo(xPos + width, yPos + (height / 2))
    this.canvas.stroke()
  }

  getNode() {
    return this.node
  }
}