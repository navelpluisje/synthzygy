import { PositionType } from 'src/types';
import { colors } from '../constants';
import { ParentModule } from '@interfaces/index';
import { drawIcon } from './icons';

export interface ISynthModuleInput {
  draw(): void
  getPosition(): PositionType
  isInputClicked(xPos: number, yPos: number): boolean
}

export class SynthModuleInput implements ISynthModuleInput {
  parent: ParentModule
  index: number
  canvas: CanvasRenderingContext2D
  type: string
  active: boolean = false

  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, index: number, type: string) {
    this.canvas = canvas
    this.parent = parent
    this.index = index
    this.type = type
  }

  draw() {
    const { height } = this.parent.dimensions
    const { x, y } = this.parent.position
    const size = 30
    this.canvas.strokeStyle = colors.transBlack

    const yStart = y + height - size * this.index
    this.canvas.beginPath()
    this.canvas.moveTo(x + size, yStart)
    this.canvas.lineTo(x + size, yStart - size);
    this.canvas.lineTo(x, yStart - size);
    this.canvas.stroke();

    drawIcon(this.canvas, this.type, this.getIconPosition())
  }

  getPosition(): PositionType {
    const { height } = this.parent.dimensions
    const { x, y } = this.parent.position

    const yInput = y + height - 30 * this.index // top-left
    const xInput = x

    return {
      x: xInput + 15,
      y: yInput - 15
    }
  }

  getIconPosition(): PositionType {
    const { height } = this.parent.dimensions
    const { x, y } = this.parent.position

    const yInput = y + height - 30 * this.index // top-left
    const xInput = x

    return {
      x: xInput + 42,
      y: yInput - 15
    }
  }

  isInputClicked(xPos: number, yPos: number): boolean {
    const { height } = this.parent.dimensions
    const { x, y } = this.parent.position

    const yInput = y + height - 30 * this.index // top-left
    const xInput = x

    if (xPos > xInput && (xInput + 30) > xPos) {
      if (yPos < yInput && (yInput - 30) < yPos) {
        return true
      }
    }

    return false
  }

  unSet() {
    this.active = false
  }
}