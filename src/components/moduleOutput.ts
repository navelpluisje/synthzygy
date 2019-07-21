import { PositionType } from './../types';
import { colors } from '../constants';
import { ParentModule } from '@interfaces/index';
import { drawIcon } from './icons';

export interface ISynthModuleOutput {
  draw(): void
  isOutputClicked(xPos: number, yPos: number): boolean
}

export class SynthModuleOutput {
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
    const {height, width } = this.parent.dimensions
    const { x, y } = this.parent.position
    const size = 30

    this.canvas.strokeStyle = colors.transBlack
    const yStart = y + height - size * this.index
    this.canvas.beginPath()
    this.canvas.moveTo(x + width - size, yStart)
    this.canvas.lineTo(x + width - size, yStart - size);
    this.canvas.lineTo(x + width, yStart - size);
    this.canvas.stroke();

    drawIcon(this.canvas, this.type, this.getIconPosition())
  }

  getPosition(): PositionType {
    const { height, width } = this.parent.dimensions
    const { x, y } = this.parent.position

    const yOutput = y + height - 30 * this.index // top-left
    const xOutput = x + width - 30

    return {
      x: xOutput + 15,
      y: yOutput - 15
    }
  }

  getIconPosition(): PositionType {
    const { height, width } = this.parent.dimensions
    const { x, y } = this.parent.position

    const yOutput = y + height - 30 * this.index // top-left
    const xOutput = x + width - 30

    return {
      x: xOutput - 12,
      y: yOutput - 15
    }
  }

  isOutputClicked(xPos: number, yPos: number): PositionType | null {
    this.active = false
    const { height, width } = this.parent.dimensions
    const { x, y } = this.parent.position

    const yOutput = y + height - 30 * this.index // top-left
    const xOutput = x + width

    if (xPos < xOutput && xOutput < (xPos + 30)) {
      if (yPos < yOutput  && (yOutput - 30) < yPos) {
        return {
          x: xOutput + 15,
          y: yOutput - 15
        }
      }
    }
    return null
  }

  unSet() {
    this.active = false
  }
}