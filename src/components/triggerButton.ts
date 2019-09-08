import { drawIcon } from './icons';
import { PositionType, ControlType } from 'src/types';
import { Colors, knobSizes } from 'src/constants';
import { ParentModule } from '@interfaces/index';
import { SynthModuleControl } from '@interfaces/moduleControl';

export class TriggerButton implements SynthModuleControl {
  parent: ParentModule
  canvas: CanvasRenderingContext2D
  color: string
  active: boolean = false
  position: PositionType
  size: number
  onPress: Function
  onRelease: Function

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    button: ControlType,
    onPress: Function,
    onRelease: Function,
    color: string
  ) {
    this.canvas = canvas
    this.parent = parent
    this.position = button.position
    this.size = knobSizes[button.size].radius
    this.onPress = onPress
    this.onRelease = onRelease
    this.color = color
  }

  draw() {
    const { x, y } = this.getPosition()

    this.canvas.save()
    this.canvas.beginPath()
    this.canvas.strokeStyle = Colors.ControlLabel
    this.canvas.fillStyle = this.active ? this.color : Colors.ControlBackground
    this.canvas.arc(x, y, this.size, 0, 2* Math.PI)
    this.canvas.fill()
    this.canvas.stroke()
    drawIcon(this.canvas, 'gate', this.getPosition(), 'white')
    this.canvas.restore()
  }

  getPosition(): PositionType {
    const { x, y } = this.position
    const { x: parX, y: parY} = this.parent.getPosition()

    return {
      x: x + parX,
      y: y + parY,
    }
  }

  isControlPressed(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition()

    if (xPos > x - this.size  && xPos < x + this.size) {
      if (yPos > y - this.size  && yPos < y + this.size) {
        this.active = true
        this.onPress()
        return true
      }
    }
    return false
  }

  isControlReleased(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition()
    if (this.active) {
      this.active = false
      this.onRelease()
      return true
    }
    return false
  }

  onMouseMove(event: MouseEvent): void {
  }
  setValue(value: number): void {
  }

  unSet() {
    // this.active = false
  }
}