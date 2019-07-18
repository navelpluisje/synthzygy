import { OutputType, InputType } from '../types';
import { colors } from 'src/constants';

export class Connection {
  static canvas: CanvasRenderingContext2D

  start: OutputType
  end: InputType

  constructor(start: OutputType, end: InputType) {
    this.start = start
    this.end = end

    this.connect()
  }

  draw() {
    const start = this.start.component.getPosition()
    const end = this.end.component.getPosition()
    const tightness = 100
    const offset = end.x < start.x ? -.25 : .25
    Connection.canvas.lineWidth = 4
    // Create the plugs first
    Connection.canvas.strokeStyle = colors.transBlack
    Connection.canvas.beginPath();
    Connection.canvas.arc(start.x, start.y, 8, 0, Math.PI * 2)
    Connection.canvas.stroke();
    Connection.canvas.beginPath();
    Connection.canvas.arc(end.x, end.y, 8, 0, Math.PI * 2)
    Connection.canvas.stroke();

    // Create the actual cable
    Connection.canvas.lineCap = 'round'
    Connection.canvas.shadowBlur = 1
    Connection.canvas.shadowColor = 'black'
    Connection.canvas.strokeStyle = `hsla(0, 50%, 50%, 0.5)`
    Connection.canvas.lineWidth = 6
    Connection.canvas.beginPath();
    Connection.canvas.moveTo(start.x, start.y);
    Connection.canvas.bezierCurveTo(
      start.x + Math.abs(start.x - end.x) * offset,
      start.y + tightness,
      end.x - Math.abs(start.x - end.x) * offset,
      end.y + tightness,
      end.x,
      end.y);
    Connection.canvas.stroke();
    // reset som stuff
    Connection.canvas.lineWidth = 1
    Connection.canvas.shadowBlur = 0
  }

  connect() {
    this.start.node.connect((<AudioNode>this.end.node))
  }

  disconnect() {
    this.start.node.disconnect()
  }
}