import { PositionType, ControlType } from 'src/types';
import { Colors, knobSizes } from 'src/constants';
import { ParentModule } from '@interfaces/index';

export class ThreeStateButton {
  parent: ParentModule
  canvas: CanvasRenderingContext2D
  color: string
  active: boolean = false
  position: PositionType
  size: number = 8
  onClick: Function

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    button: ControlType,
    onClick: Function,
    color: string
  ) {
    this.canvas = canvas
    this.parent = parent
    this.position = button.position
    this.onClick = onClick
    this.color = color
  }

  public draw() {
    const { x, y } = this.getPosition()

    this.canvas.save()
    this.canvas.beginPath()
    this.canvas.lineWidth = 2
    this.canvas.strokeStyle = this.color
    this.canvas.fillStyle = Colors.ControlBackground
    this.canvas.arc(x, y, this.size, 0, 2 * Math.PI)
    this.canvas.fill()
    this.canvas.stroke()
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

  public getActive(): boolean {
    return this.active
  }

  isControlClicked(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition()

    if (xPos > x - this.size  && xPos < x + this.size) {
      if (yPos > y - this.size  && yPos < y + this.size) {
        this.active = !this.active
        this.onClick()
        return true
      }
    }
    return false
  }

  unSet() {
    // this.active = false
  }
}