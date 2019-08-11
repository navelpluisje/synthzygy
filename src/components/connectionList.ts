import { PositionType, OutputType, InputType } from 'src/types';
import { Connection } from "./connection";
import { Synth } from 'src/app/synth';

export class ConnectionList {
  static canvas: CanvasRenderingContext2D
  private connections: Connection[] = []
  newConnection: Connection = null
  newPosition: PositionType

  public hasNewConnection(): boolean {
    return this.newConnection !== null
  }

  public setNewConnection(start: OutputType, event: MouseEvent) {
    const { layerX: x, layerY: y} = event
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
        x: event.layerX,
        y: event.layerY,
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
    const {layerX, layerY} = event
    const prevLength = this.connections.length

    this.connections = this.connections.filter(connection => {
      const inputSelected = connection.end.component.isInputClicked(layerX, layerY)
      const outputSelected = connection.start.component.isOutputClicked(layerX, layerY) !== null
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

  public draw = () => {
    const {width, height} = Synth.canvasDimension
    const canvas = ConnectionList.canvas
    canvas.clearRect(0, 0, width, height)

    this.connections.forEach(connection => connection.draw(canvas))
    if (this.newConnection) {
      this.newConnection.draw(canvas, this.newPosition)
    }
  }
}