import { Colors } from '@constants/enums';
import { ParentModule } from 'src/interfaces';
import { LabelType, PositionType } from 'src/types';

export class Label {
  private position: PositionType;
  private canvas: CanvasRenderingContext2D;
  private parent: ParentModule;
  private label: string;

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    control: LabelType,
  ) {
    this.canvas = canvas;
    this.parent = parent;
    this.position = control.position;
    this.label = control.label;
  }

  public draw(label?: string) {
    this.label = label || this.label;
    const {x: xPos, y: yPos} = this.getLabelPosition();
    const yLabel = yPos;

    this.canvas.save();
    this.canvas.font = '13px Raleway, sans-serif';
    this.canvas.textAlign = 'center';
    this.canvas.textBaseline = 'middle';
    this.canvas.fillStyle = Colors.ControlLabel;
    this.canvas.fillText(this.label, xPos, yLabel);
    this.canvas.restore();
  }

  private getLabelPosition(): PositionType {
    const {x: parentX, y: parentY} = this.parent.getPosition();
    return {
      x: this.position.x + parentX,
      y: this.position.y + parentY,
    };
  }
}
