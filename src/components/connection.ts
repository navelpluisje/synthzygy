import { PositionType } from './../types';
import { OutputType, InputType } from '../types';
import { Colors } from 'src/constants';

type ConnectionColors = {
  [key: string]: string,
}

export class Connection {
  static connectionColors: ConnectionColors = {
    gate: 'hsla(167, 65%, 57%, .7)',
    audio: 'hsla(347, 65%, 57%, .7)',
  }

  start: OutputType
  end: InputType
  type: string

  constructor(start: OutputType, end?: InputType) {
    this.start = start
    this.type = start.type
    end && (this.end = end)
  }

  setEnd(end: InputType) {
    this.end = end
  }

  draw(canvas: CanvasRenderingContext2D, endPosition?: PositionType) {
    const start = this.start.component.getPosition()
    const end = endPosition || this.end.component.getPosition()
    const tightness = 100
    const offset = end.x < start.x ? -.25 : .25

    canvas.lineWidth = 4
    // Create the plugs first
    canvas.strokeStyle = Colors.TransBlack
    canvas.beginPath();
    canvas.arc(start.x, start.y, 5, 0, Math.PI * 2)
    canvas.stroke();
    canvas.beginPath();
    canvas.arc(end.x, end.y, 5, 0, Math.PI * 2)
    canvas.stroke();

    // Create the actual cable
    canvas.lineCap = 'round'
    canvas.shadowBlur = 1
    canvas.shadowColor = 'black'
    canvas.strokeStyle = Connection.connectionColors[this.type]// `hsla(0, 50%, 50%, 0.7)`
    canvas.lineWidth = 4
    canvas.beginPath();
    canvas.moveTo(start.x, start.y);
    canvas.bezierCurveTo(
      start.x + Math.abs(start.x - end.x) * offset,
      start.y + tightness,
      end.x - Math.abs(start.x - end.x) * offset,
      end.y + tightness,
      end.x,
      end.y);
    canvas.stroke();
    // reset som stuff
    canvas.lineWidth = 1
    canvas.shadowBlur = 0
  }

  connect() {
    switch (this.start.type) {
      case 'gate':
        this.start.gate.connect(this.end.gate)
        break
      case 'audio':
        this.start.node.connect(<AudioNode>this.end.node)
        break
    }
  }

  disconnect() {
    // this.start.node.disconnect()
  }
}