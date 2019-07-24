import { PositionType, ModuleOutputType } from './../types';
import { Colors } from '../constants';
import { ParentModule } from '@interfaces/index';
import { drawIcon } from './icons';

export interface ISynthModuleOutput {
  draw(): void
  isOutputClicked(xPos: number, yPos: number): boolean
}

export class SynthModuleOutput {
  parent: ParentModule
  canvas: CanvasRenderingContext2D
  type: string
  position: PositionType
  active: boolean = false

  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, output: ModuleOutputType) {
    this.canvas = canvas
    this.parent = parent
    this.type = output.icon
    this.position = output.position
  }

  draw() {
    const { x, y } = this.getPosition()

    this.canvas.save()
    this.canvas.strokeStyle = Colors.TransBlack
    this.canvas.beginPath()
    this.canvas.arc(x, y, 10, 0, 2 * Math.PI)
    this.canvas.stroke();
    this.canvas.beginPath()
    this.canvas.fillStyle = Colors.TransBlack
    this.canvas.arc(x, y, 6, 0, 2 * Math.PI)
    this.canvas.fill()
    this.canvas.beginPath()
    this.canvas.moveTo(x - 10, y)
    this.canvas.lineTo(x - 15, y)
    this.canvas.stroke();
    this.canvas.restore()

    drawIcon(this.canvas, this.type, this.getIconPosition())
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