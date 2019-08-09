import { ModuleInputType, DimensionType } from './../types';
import { PositionType } from 'src/types';
import { ParentModule } from '@interfaces/index';
import { drawIcon } from './icons';

export interface SynthModuleInput {
  draw(): void
  getPosition(): PositionType
  isInputClicked(xPos: number, yPos: number): boolean
}

export class SynthModuleInput implements SynthModuleInput {
  parent: ParentModule
  canvas: CanvasRenderingContext2D
  type: string
  position: PositionType
  active: boolean = false
  connections?: PositionType[]
  showIcon: boolean
  color: string

  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, input: ModuleInputType, color: string) {
    this.canvas = canvas
    this.parent = parent
    this.type = input.icon
    this.position = input.position
    this.connections = input.connection || []
    this.showIcon = input.showIcon || false
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
    if (this.showIcon) {
      this.canvas.beginPath()
      this.canvas.moveTo(x + 10, y)
      this.canvas.lineTo(x + 15, y)
      this.canvas.stroke();
    }
    this.canvas.restore()

    this.drawConnection()
    this.showIcon && drawIcon(this.canvas, this.type, this.getIconPosition(), this.color)
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
      x: x + 25,
      y: y,
    }
  }

  drawConnection() {
    const {x: startX, y: startY} = this.getPosition()
    const {x: parX, y: parY} = this.parent.position
    this.canvas.save()
    this.canvas.strokeStyle = this.color
    this.canvas.lineWidth = 1.5
    this.canvas.setLineDash([5, 5])
    this.canvas.beginPath()
    this.canvas.moveTo(startX + 10, startY)
    this.connections.forEach(({x, y}) => {
      this.canvas.lineTo(x + parX, y + parY)
    })
    this.canvas.stroke()
    this.canvas.restore()
  }

  isInputClicked(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition()

    if (xPos > x -15 && xPos < x + 15) {
      if (yPos > y - 15  && yPos < y + 15) {
        return true
      }
    }
    return false
  }

  unSet() {
    this.active = false
  }
}