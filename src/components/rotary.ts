import { STEP_ROTARY } from '../constants';
import { Colors } from '../constants';
import { PositionType, KnobSizeType, KnobSizes, ControlType } from '../types';
import { ParentModule } from 'src/interfaces';
import { knobSizes } from 'src/constants';
import { roundByStepSize } from '@utilities/numeric';
import { SynthModuleControl } from '@interfaces/moduleControl';

export class Rotary implements SynthModuleControl {
  static rotaryCanvas: CanvasRenderingContext2D
  position: PositionType
  knobSize: KnobSizeType
  size: KnobSizes
  canvas: CanvasRenderingContext2D
  type: string
  active: boolean = false
  mouseStart: PositionType
  parent: ParentModule
  valueData: any
  value: number
  label: string
  color: string
  callback: Function
  cap: CanvasLineCap

  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, control: ControlType, callback: Function, color: string = 'red') {
    const { min, max, log, step } = control
    this.canvas = canvas
    this.parent = parent
    this.knobSize = knobSizes[control.size]
    this.position = control.position
    this.valueData = { min, max, log, step }
    this.value = control.value
    this.label = control.label
    this.type = control.type
    this.callback = callback
    this.color = color
    this.cap = this.type === STEP_ROTARY ? 'butt' : 'round'
  }

  draw() {
    this.drawRotaryRing()
    this.drawRotaryBase()
    this.drawRotaryValue()
    this.label && this.drawRotaryLabel()
  }

  public setValue(value: number) {
    this.value = value
    // this.drawRotaryValue()
    this.callback(this.value)
  }

  getValue(): number {
    return this.value
  }

  drawRotaryRing() {
    const {x: xPos, y: yPos} = this.getRotaryPosition()

    this.canvas.save()
    this.canvas.beginPath()
    this.canvas.translate(xPos, yPos)
    this.canvas.arc(0, 0, this.knobSize.radius + 7, Math.PI * .75, Math.PI * 2.25)
    this.canvas.strokeStyle = Colors.ControlRing
    this.canvas.lineWidth = 4
    this.canvas.lineCap = this.cap
    this.canvas.stroke()
    this.canvas.restore()
  }

  drawStepMarkers() {
    const {min, max, step} = this.valueData
    const {x: xPos, y: yPos} = this.getRotaryPosition()
    const steps = (max - min) / step // Get the number of steps
    const canvas = Rotary.rotaryCanvas

    canvas.save()
    canvas.lineWidth = 3
    canvas.strokeStyle = Colors.ModuleBackground

    for (let i = 0; i <= steps; i++) {
      canvas.save()
      canvas.beginPath()
      canvas.translate(xPos, yPos)
      canvas.rotate(Math.PI * .75 + (Math.PI * 1.5 * i) / steps)
      canvas.moveTo(this.knobSize.radius + 10, 0)
      canvas.lineTo(this.knobSize.radius + 4, 0)
      canvas.stroke()
      canvas.restore()
    }
    canvas.restore()
  }

  drawRotaryBase() {
    const {x: xPos, y: yPos} = this.getRotaryPosition()

    this.canvas.save()
    this.canvas.fillStyle = Colors.ControlBackground
    this.canvas.strokeStyle = Colors.ControlBorder
    this.canvas.lineWidth = 1
    this.canvas.beginPath()
    this.canvas.arc(xPos, yPos, this.knobSize.radius - 1, 0, Math.PI * 2, true) // Outer circle
    this.canvas.stroke()
    this.canvas.fill()
    this.canvas.restore()
  }

  drawRotaryValue() {
    const {x: xPos, y: yPos} = this.getRotaryPosition()
    const { min, max, log } = this.valueData
    const range = max - min
    const rangeOffset = 0 - min
    const pos = Math.min(
      ((this.value + rangeOffset) / range) * 1.5 * Math.PI,
      1.5 + Math.PI
    ) || 0
    const canvas = Rotary.rotaryCanvas

    canvas.clearRect(
      xPos - (this.knobSize.radius + 10),
      yPos - (this.knobSize.radius + 10),
      this.knobSize.radius * 2 + 20,
      this.knobSize.radius * 2 + 20
    )

    canvas.save()
    canvas.beginPath()
    canvas.translate(xPos, yPos)
    canvas.arc(0, 0, this.knobSize.radius + 7, Math.PI * .75, pos + Math.PI * .75)
    canvas.strokeStyle = this.color
    canvas.lineWidth = 4
    canvas.lineCap = this.cap
    canvas.stroke()
    canvas.restore()
    if (this.type === STEP_ROTARY) {
      this.drawStepMarkers()
    }

  }

  drawRotaryLabel() {
    const {x: xPos, y: yPos} = this.getRotaryPosition()
    const yLabel = yPos + this.knobSize.radius + 6

    this.canvas.font ='13px Raleway, sans-serif'
    this.canvas.textAlign ='center'
    this.canvas.textBaseline = 'middle'
    this.canvas.fillStyle = Colors.ControlLabel
    const rectHeight = 16
    this.canvas.fillText(this.label, xPos, yLabel + (rectHeight / 2))
  }

  isControlPressed(xPos: number, yPos: number): boolean {
    const {x: xRotPos, y: yRotPos} = this.getRotaryPosition()
    const x = xRotPos - this.knobSize.radius
    const y = yRotPos - this.knobSize.radius

    if (x < xPos && xPos < (x + this.knobSize.radius * 3)) {
      if (y < yPos && yPos < (y + this.knobSize.radius * 3)) {
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

  onMouseMove(event: MouseEvent): void {
    let newValue = 0
    const {min, max, log, step} = this.valueData
    const steps = (max - min) / step // Get the number of steps
    let stepSize = 1;
    let logSize = 1;
    if (steps < 100) {
      stepSize = 100 / steps
    }
    if (steps > 5000) {
      logSize = 2
    }
    // TODO: Optimize the value calculation
    const mouseOffset = this.mouseStart.y - event.offsetY

    // If no mouseoffset, there is no change, so skip it
    if (mouseOffset !== 0 && mouseOffset >= stepSize || mouseOffset <= stepSize) {
      if (log) {
        newValue = this.value + (mouseOffset / stepSize) * step * (Math.abs(event.movementY) ** logSize || 1)
      } else {
        newValue = this.value + (mouseOffset / stepSize) * step
      }

      // Get the rounded new Value
      newValue = roundByStepSize(
        Math.max(
          Math.min(
            newValue,
            max
          ),
          min
        ),
        step || 0.1
      )
      // If the value did not change, do not do a thing
      if (this.value !== newValue) {
        this.value = newValue
        this.mouseStart.y = event.offsetY
        this.callback(this.value)
        requestAnimationFrame(this.drawRotaryValue.bind(this, true))
      }
    }
  }

  isControlReleased(x: number, y: number): boolean {
    const {x: xRotPos, y: yRotPos} = this.getRotaryPosition()
    const xPos = xRotPos - this.knobSize.radius
    const yPos = yRotPos - this.knobSize.radius

    if (xPos < x && x < (xPos + this.knobSize.radius * 3)) {
      if (yPos < y && y < (yPos + this.knobSize.radius * 3)) {
        this.active = false;
        return true
      }
    }
    return false
  }

  private getRotaryPosition(): PositionType {
    const {x: parentX, y: parentY} = this.parent.getPosition()
    return {
      x: this.position.x + parentX,
      y: this.position.y + parentY,
    }
  }

  unSet() {
    this.active = false
  }
}