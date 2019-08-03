import { OutputType, InputType } from '../types';
import { Colors } from 'src/constants';

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
    Connection.canvas.strokeStyle = Colors.TransBlack
    Connection.canvas.beginPath();
    Connection.canvas.arc(start.x, start.y, 5, 0, Math.PI * 2)
    Connection.canvas.stroke();
    Connection.canvas.beginPath();
    Connection.canvas.arc(end.x, end.y, 5, 0, Math.PI * 2)
    Connection.canvas.stroke();

    // Create the actual cable
    Connection.canvas.lineCap = 'round'
    Connection.canvas.shadowBlur = 1
    Connection.canvas.shadowColor = 'black'
    Connection.canvas.strokeStyle = `hsla(0, 50%, 50%, 0.7)`
    Connection.canvas.lineWidth = 4
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
    switch (this.start.type) {
      case 'gate':
        this.start.gate.connect(this.end.gate)
        break
      case 'audio':
        this.start.node.connect(<AudioParam>this.end.node)
        break
    }
  }

  disconnect() {
    // this.start.node.disconnect()
  }
}