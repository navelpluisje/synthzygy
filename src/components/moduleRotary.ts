import { colors } from '../constants';
import { PositionType, KnobSizeType, KnobSizes, ControlType } from '../types';
import { IParentModule } from 'src/interfaces';
import { knobSizes } from 'src/constants';
import { roundByStepSize } from '@utilities/numeric';

export interface ISynthModuleRotary {
  draw(): void
  isRotaryClicked(xPos: number, yPos: number): boolean
  setRotaryValue(event: MouseEvent): void
}

export class SynthModuleRotary implements ISynthModuleRotary {
  static rotaryCanvas: CanvasRenderingContext2D
  position: PositionType
  knobSize: KnobSizeType
  size: KnobSizes
  canvas: CanvasRenderingContext2D
  type: string
  active: boolean = false
  mouseStart: PositionType
  parent: IParentModule
  valueData: any
  value: number
  label: string
  callback: Function

  constructor(canvas: CanvasRenderingContext2D, parent: IParentModule, control: ControlType, callback: Function) {
    const { min, max, log, step } = control
    this.canvas = canvas
    this.parent = parent
    this.knobSize = knobSizes[control.size]
    this.position = control.position
    this.valueData = { min, max, log, step }
    this.value = control.value
    this.label = control.label
    this.callback = callback
  }

  draw() {
    this.drawRotaryRing()
    this.drawRotaryBase()
    this.drawRotaryValue()
    this.label && this.drawRotaryLabel()
  }

  setValue(value: number) {
    this.value = value
    console.log('setValue')
    // this.drawRotaryValue(true)
    this.callback(this.value)
  }

  getValue(): number {
    return this.value
  }

  drawRotaryRing() {
    const xPos = this.position.x + this.parent.position.x
    const yPos = this.position.y + this.parent.position.y
    this.canvas.lineWidth = 1
    this.canvas.lineCap = 'round'
    this.canvas.strokeStyle = colors.transBlack

    for (let i = 0; i < 11; i++) {
      this.canvas.save()
      this.canvas.beginPath()
      this.canvas.translate(xPos, yPos)
      this.canvas.rotate(Math.PI / 6 * (i + 4))
      this.canvas.moveTo(this.knobSize.radius + 6, 0)
      this.canvas.lineTo(this.knobSize.radius + 3, 0)
      this.canvas.stroke()
      this.canvas.restore()
    }
  }

  drawRotaryBase() {
    const xPos = this.position.x + this.parent.position.x
    const yPos = this.position.y + this.parent.position.y

    this.canvas.save()
    this.canvas.fillStyle = colors.transWhite
    this.canvas.strokeStyle = colors.transBlack
    this.canvas.lineWidth = 2
    this.canvas.beginPath()
    this.canvas.arc(xPos, yPos, this.knobSize.radius, 0, Math.PI * 2, true) // Outer circle
    this.canvas.stroke()
    this.canvas.fill()
    this.canvas.restore()
  }

  drawRotaryValue() {
    const xPos = this.position.x + this.parent.position.x
    const yPos = this.position.y + this.parent.position.y
    const { min, max, log } = this.valueData
    const range = max - min
    const rangeOffset = 0 - min
    const pos = Math.min(((log ? Math.sqrt(this.value + rangeOffset) : this.value + rangeOffset) / range) * 1.7, 1.7) || 0
    const canvas = SynthModuleRotary.rotaryCanvas

    canvas.clearRect(
      xPos - this.knobSize.radius,
      yPos - this.knobSize.radius,
      this.knobSize.radius * 2,
      this.knobSize.radius * 2
    )
    canvas.save()
    canvas.strokeStyle = colors.transBlack
    canvas.lineWidth = 4
    canvas.lineCap = 'round'
    canvas.translate(xPos, yPos)
    canvas.rotate(Math.PI * .65 + Math.PI * pos)
    canvas.beginPath()
    canvas.moveTo(this.knobSize.radius - this.knobSize.baseOffset, 0)
    canvas.lineTo((this.knobSize.radius - this.knobSize.baseOffset) / 2, 0)
    canvas.stroke()
    canvas.restore()
  }

  drawRotaryLabel() {
    const xPos = this.position.x + this.parent.position.x
    const yLabel = this.position.y + this.parent.position.y + this.knobSize.radius + this.knobSize.baseOffset * 1.5

    this.canvas.font='16px Raleway'
    this.canvas.textAlign='center'
    this.canvas.textBaseline = 'middle'
    this.canvas.fillStyle = colors.transBlack
    const rectHeight = 16
    this.canvas.fillText(this.label, xPos, yLabel + (rectHeight / 2))
  }

  isRotaryClicked(x: number, y: number): boolean {
    const xPos = this.parent.position.x + this.position.x - this.knobSize.radius
    const yPos = this.parent.position.y + this.position.y - this.knobSize.radius

    if (xPos < x && x < (xPos + this.knobSize.radius * 3)) {
      if (yPos < y && y < (yPos + this.knobSize.radius * 3)) {
        this.active = true;
        this.mouseStart = {
          x,
          y,
        }
        return true
      }
    }
    return false
  }

  setRotaryValue(event: MouseEvent): void {
    let newValue = 0
    if (this.valueData.log) {
      newValue = Math.sqrt(this.value) + (this.mouseStart.y - event.layerY) * Math.abs(event.movementY || 1) / this.valueData.max
    } else {
      newValue = this.value + (this.mouseStart.y - event.layerY) / this.valueData.max
    }
    this.value = roundByStepSize(
      Math.max(
        Math.min(
          this.valueData.log ? newValue ** 2 : newValue,
          this.valueData.log ? this.valueData.max ** 2: this.valueData.max
        ),
        this.valueData.log ? this.valueData.min ** 2: this.valueData.min
      ),
      this.valueData.step || 0.1
    )
    this.callback(this.value)
    requestAnimationFrame(this.drawRotaryValue.bind(this, true))
  }

  unSet() {
    this.active = false
  }
}