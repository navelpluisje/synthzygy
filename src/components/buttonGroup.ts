import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule } from '@interfaces/index';

export interface ButtonGroup {
  draw(): void
  isButtonClicked(xPos: number, yPos: number): void
}

type ModuleButtonType = {
  label: string,
  value: string,
}

type DirectionType = 'vertical' | 'horizontal'

export type ModuleButtonsList = ModuleButtons[]

export type ModuleButtons = {
  position: PositionType
  dimensions: DimensionType
  direction: DirectionType
  active: string
  buttons: ModuleButtonType[]
}

export class ButtonGroup implements ButtonGroup {
  parent: ParentModule
  canvas: CanvasRenderingContext2D
  color: string
  buttons: ModuleButtonType[]
  activeButton: string
  position: PositionType
  callback: Function
  buttonDimension: DimensionType
  direction: DirectionType

  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, buttons: ModuleButtons, callback: Function, color: string) {
    this.canvas = canvas
    this.parent = parent
    this.color = color
    this.buttons = buttons.buttons
    this.position = buttons.position
    this.activeButton = buttons.active
    this.direction = buttons.direction
    this.buttonDimension = buttons.dimensions
    this.callback = callback
  }

  draw() {
    const { x, y } = this.getPosition()
    const {width, height} = this.buttonDimension
    let buttonX = x;
    let buttonY = y;

    this.canvas.save()
    this.canvas.strokeStyle = Colors.ModuleBackground
    this.canvas.fillStyle = Colors.ControlBackground
    this.canvas.font ='12px Raleway, sans-serif'
    this.canvas.textAlign ='center'
    this.canvas.textBaseline = 'middle'
    this.canvas.fillStyle = Colors.ControlLabel

    this.buttons.forEach((button, index) => {
      if (this.direction === 'vertical') {
        buttonY = y + index * height
      } else {
        buttonX = x + index * width
      }
      this.canvas.fillStyle = Colors.ControlBackground
      this.canvas.beginPath()
      this.canvas.rect(buttonX, buttonY, width, height)
      if (this.activeButton === button.value) {
        this.canvas.fillStyle = this.color
      }
      this.canvas.fill()
      this.canvas.stroke()

      this.canvas.save()
      this.canvas.beginPath()
      this.canvas.fillStyle = Colors.ControlLabel
      this.canvas.shadowOffsetX = .5
      this.canvas.shadowOffsetY = .5
      this.canvas.shadowBlur = 1
      this.canvas.shadowColor = Colors.ModuleBackground
      this.canvas.fillText(button.label, buttonX + width / 2, buttonY + height / 2)
      this.canvas.restore()
    })
    this.canvas.restore()
  }

  getPosition(): PositionType {
    const { x: parX, y: parY } = this.parent.getPosition()
    const { x, y } = this.position

    return {
      x: x + parX,
      y: y + parY,
    }
  }

  isButtonClicked(xPos: number, yPos: number): void {
    const { x, y } = this.getPosition()
    const {width, height} = this.buttonDimension
    let buttonX = x;
    let buttonY = y;

    this.buttons.some((button, index) => {
      if (this.direction === 'vertical') {
        buttonY = y + index * height
      } else {
        buttonX = x + index * width
      }

      if (xPos > buttonX  && xPos < buttonX + width) {
        if (yPos > buttonY  && yPos < buttonY + height) {
          this.activeButton = button.value
          this.callback(button.value)
          return true
        }
      }
    })
  }

  unSet() {
    // this.active = false
  }
}