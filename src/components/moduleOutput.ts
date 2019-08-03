import { PositionType, ModuleOutputType } from './../types';
import { ParentModule } from '@interfaces/index';
import { drawIcon } from './icons';

export interface SynthModuleOutput {
  draw(): void
  isOutputClicked(xPos: number, yPos: number): PositionType | null
}

export class SynthModuleOutput implements SynthModuleOutput {
  parent: ParentModule
  canvas: CanvasRenderingContext2D
  type: string
  position: PositionType
  active: boolean = false
  color: string

  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, output: ModuleOutputType, color: string) {
    this.canvas = canvas
    this.parent = parent
    this.type = output.icon
    this.position = output.position
    this.color = color
  }

  draw() {
    const { x, y } = this.getPosition()

    this.canvas.save()
    this.canvas.strokeStyle = this.color
    this.canvas.fillStyle = this.color
    this.canvas.beginPath()
    this.canvas.arc(x, y, 10, 0, 2 * Math.PI)
    this.canvas.stroke();
    this.canvas.beginPath()
    this.canvas.arc(x, y, 6, 0, 2 * Math.PI)
    this.canvas.fill()
    this.canvas.beginPath()
    this.canvas.moveTo(x - 10, y)
    this.canvas.lineTo(x - 15, y)
    this.canvas.stroke();
    this.canvas.restore()

    drawIcon(this.canvas, this.type, this.getIconPosition(), this.color)
  }

  getPosition(): PositionType {
    const { x: parX, y: parY } = this.parent.position
    const { x, y } = this.position

    return {
      x: x + parX,
      y: y + parY,
    }
  }

  getIconPosition(): PositionType {
    const { x, y } = this.getPosition()

    return {
      x: x - 25,
      y: y,
    }
  }

  isOutputClicked(xPos: number, yPos: number): PositionType | null {
    this.active = false
    const { x, y } = this.getPosition()

    if (xPos > x -15 && xPos < x + 15) {
      if (yPos > y - 15  && yPos < y + 15) {
        return {
          x,
          y,
        }
      }
    }
    return null
  }

  unSet() {
    this.active = false
  }
}