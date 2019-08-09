import { PositionType, OutputType, InputType } from 'src/types';
import { Connection } from "./connection";

export class ConnectionList {
  static canvas: CanvasRenderingContext2D
  private connections: Connection[] = []
  newConnection: Connection = null
  newPosition: PositionType

  public hasNewConnection(): boolean {
    return this.newConnection !== null
  }

  setNewConnection(start: OutputType, event: MouseEvent) {
    const { layerX: x, layerY: y} = event
    this.newConnection = new Connection(start)
    this.newPosition = {x, y}
  }

  onMouseMove(event: MouseEvent) {
    if (this.newConnection) {
      this.newPosition = {
        x: event.layerX,
        y: event.layerY,
      }
    }
  }

  onMouseUp(input: InputType) {
    const connection = new Connection(this.newConnection.start, input)
    connection.connect()
    this.connections.push(connection)
    this.newConnection = null
    this.newPosition = null
  }

  draw() {
    const canvas = ConnectionList.canvas
    canvas.clearRect(
      0,
      0,
      1000,
      600,
    )

    this.connections.forEach(connection => connection.draw(canvas))
    if (this.newConnection) {
      this.newConnection.draw(canvas, this.newPosition)
    }
  }
}