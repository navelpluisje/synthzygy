import { Colors } from 'src/constants/enums';
import { ConnectionData, InputType, OutputType } from '../types';
import { PositionType } from './../types';

interface ConnectionColors {
  [key: string]: string;
}

export class Connection {
  public static connectionColors: ConnectionColors = {
    audio: 'hsla(347, 65%, 57%, .7)',
    cv: 'hsla(77, 65%, 57%, .7)',
    data: 'hsla(257, 65%, 57%, .7)',
    gate: 'hsla(167, 65%, 57%, .7)',
  };

  public start: OutputType;
  public end: InputType;
  public type: string;
  public id: number;

  constructor(start: OutputType, end?: InputType) {
    this.start = start;
    this.type = start.type;
    this.id = new Date().getTime();
    if (end) {
      this.end = end;
      this.type = end.type;
    }
  }

  public getConnectionData(): ConnectionData {
    return {
      input: {
        module: this.end.module,
        name: this.end.name,
      },
      output: {
        module: this.start.module,
        name: this.start.name,
      },
    };
  }

  public setEnd(end: InputType) {
    this.end = end;
    this.type = end.type;
  }

  public draw(canvas: CanvasRenderingContext2D, endPosition?: PositionType) {
    const start = this.start.component.getPosition();
    const end = endPosition || this.end.component.getPosition();
    const tightness = 100;
    const offset = end.x < start.x ? -.25 : .25;

    canvas.lineWidth = 4;
    // Create the plugs first
    canvas.strokeStyle = Colors.TransBlack;
    canvas.beginPath();
    canvas.arc(start.x, start.y, 5, 0, Math.PI * 2);
    canvas.stroke();
    canvas.beginPath();
    canvas.arc(end.x, end.y, 5, 0, Math.PI * 2);
    canvas.stroke();

    // Create the actual cable
    canvas.lineCap = 'round';
    canvas.shadowBlur = 1;
    canvas.shadowColor = 'black';
    canvas.strokeStyle = Connection.connectionColors[this.type]; // `hsla(0, 50%, 50%, 0.7)`
    canvas.lineWidth = 4;
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
    canvas.lineWidth = 1;
    canvas.shadowBlur = 0;
  }

  public connect() {
    switch (this.start.type) {
      case 'data':
        this.start.data.connect(this.end.data, this.id);
        break;
      case 'audio':
        this.start.node.connect(this.end.node as AudioNode);
        break;
    }
  }

  public disconnect() {
    switch (this.start.type) {
      case 'data':
        this.start.data.disconnect(this.id);
        break;
      case 'audio':
        this.start.node.disconnect(this.end.node as AudioNode);
        break;
    }
  }
}
