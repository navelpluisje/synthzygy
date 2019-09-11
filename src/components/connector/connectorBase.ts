import { PositionType, SynthConnectorType } from 'src/types'
import { ParentModule } from '@interfaces/index'
import { drawIcon } from '../icons'
import { Colors } from 'src/constants'

export class SynthConnector {
  private parent: ParentModule
  private canvas: CanvasRenderingContext2D
  private name: string
  private icon: string
  private position: PositionType
  protected active: boolean = false
  private connections?: PositionType[]
  private showIcon: boolean
  private showLabel: boolean
  private color: string
  protected iconOffset: number = 0
  protected labelAlign: string = 'left'


  constructor(canvas: CanvasRenderingContext2D, parent: ParentModule, connector: SynthConnectorType, color: string) {
    this.canvas = canvas
    this.parent = parent
    this.name = connector.name
    this.icon = connector.icon
    this.position = connector.position
    this.connections = connector.connection || []
    this.showIcon = connector.showIcon || false
    this.showLabel = connector.showLabel || false
    this.color = color
  }

  public draw() {
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
    this.canvas.moveTo(x + 10 * (this.iconOffset / Math.abs(this.iconOffset)), y)
    this.canvas.lineTo(x + 15 * (this.iconOffset / Math.abs(this.iconOffset)), y)
    this.canvas.stroke();
    this.canvas.restore()

    this.connections.length && this.drawConnection()
    this.showIcon && drawIcon(this.canvas, this.icon, this.getIconPosition(), this.color)
    this.showLabel && this.drawLabel()
  }

  drawLabel() {
    const {x: xPos, y: yPos} = this.getIconPosition()

    this.canvas.font ='13px Raleway, sans-serif'
    this.canvas.textAlign ='right'
    this.canvas.textBaseline = 'middle'
    this.canvas.fillStyle = this.color
    this.canvas.fillText(this.name, xPos, yPos)
  }

  private drawConnection() {
    const {x: startX, y: startY} = this.getPosition()
    const {x: parX, y: parY} = this.parent.getPosition()
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

  public getPosition(): PositionType {
    const { x: parX, y: parY } = this.parent.getPosition()
    const { x, y } = this.position

    return {
      x: x + parX,
      y: y + parY,
    }
  }

  private getIconPosition(): PositionType {
    const { x, y } = this.getPosition()
    let offset = this.iconOffset;

    if (this.showLabel) {
      offset = Math.sign(offset) * (Math.abs(offset) - 5)
    }

    return {
      x: x + offset,
      y: y,
    }
  }

  unSet() {
    this.active = false
  }
}