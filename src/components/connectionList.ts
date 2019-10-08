import { PositionType, OutputType, InputType, DimensionType } from 'src/types';
import { Connection } from "./connection";
import { Synth } from 'src/app/synth';
import { InputConnector, OutputConnector } from '@components/index';

export class ConnectionList {
  static canvas: CanvasRenderingContext2D
  private connections: Connection[] = []
  newConnection: Connection = null
  newPosition: PositionType

  public hasNewConnection(): boolean {
    return this.newConnection !== null
  }

  public setNewConnection(start: OutputType, event: MouseEvent) {
    const { offsetX: x, offsetY: y} = event
    this.newConnection = new Connection(start)
    this.newPosition = {x, y}
    requestAnimationFrame(this.draw)
  }

  public removeNewConnection() {
    this.newConnection = null
    this.newPosition = null
    requestAnimationFrame(this.draw)
  }

  public updateConnection(event: MouseEvent) {
    if (this.newConnection) {
      this.newPosition = {
        x: event.offsetX,
        y: event.offsetY,
      }
      requestAnimationFrame(this.draw)
    }
  }

  public createConnection(input: InputType) {
    const connection = new Connection(this.newConnection.start, input)
    connection.connect()
    this.connections.push(connection)
    this.removeNewConnection()
  }

  public removeConnection(event: MouseEvent) {
    const {offsetX, offsetY} = event
    const prevLength = this.connections.length

    this.connections = this.connections.filter(connection => {
      const inputSelected = connection.end.component.isInputClicked(offsetX, offsetY)
      const outputSelected = connection.start.component.isOutputClicked(offsetX, offsetY) !== null
      const keepConnection = !(outputSelected || inputSelected)
      if (!keepConnection) {
        connection.disconnect()
      }
      return keepConnection
    })

    if (prevLength !== this.connections.length) {
      requestAnimationFrame(this.draw)
    }
  }

  private isConnectionInModule(
    component: InputConnector | OutputConnector,
    modulePosition: PositionType,
    moduleDimension: DimensionType
  ) {
    const {x: moduleX, y: moduleY} = modulePosition
    const {width, height} = moduleDimension
    const {x, y} = component.getPosition()
    if (
      x > moduleX
      && x < moduleX + width
      && y > moduleY
      && y < moduleY + height
    ) {
      return true
    }
    return false
  }

  public removeConnectionsByModule(position: PositionType, dimensions: DimensionType) {
    const prevLength = this.connections.length

    this.connections = this.connections.filter(connection => {
      const removeInput = this.isConnectionInModule(connection.end.component, position, dimensions)
      const removeOutput = this.isConnectionInModule(connection.start.component, position, dimensions)
      const removeConnection = removeInput || removeOutput
      if (removeConnection) {
        connection.disconnect()
      }
      return !removeConnection
    })

    if (prevLength !== this.connections.length) {
      requestAnimationFrame(this.draw)
    }
  }

  public draw = () => {
    const {width, height} = Synth.canvasDimension
    const canvas = ConnectionList.canvas
    if (canvas) {
      canvas.clearRect(0, 0, width, height)

      this.connections.forEach(connection => connection.draw(canvas))
      if (this.newConnection) {
        this.newConnection.draw(canvas, this.newPosition)
      }
    }
  }
}