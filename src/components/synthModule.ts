import { Colors } from '@constants/enums';
import { fillRoundedRect } from '@utilities/roundedRect';
import { DimensionType, PositionType } from 'src/types';

export class SynthModule {
  public position: PositionType;
  public dimensions: DimensionType;
  public color: string;
  public title: string;
  public canvas: CanvasRenderingContext2D;
  public offset: PositionType;

  constructor(canvas: CanvasRenderingContext2D, dimensions: DimensionType, position: PositionType, color: string) {
    this.canvas = canvas;
    this.dimensions = dimensions;
    this.position = position;
    this.color = color;
  }

  public draw() {
    const {x, y} = this.position;
    const {width, height} = this.dimensions;
    const radius = 5;

    this.canvas.fillStyle = this.color;
    // Draw the block itself
    fillRoundedRect(this.canvas, x, y, width, height, radius);
    // Draw the light shadow
    this.canvas.fillStyle = Colors.TransWhite;
    this.canvas.beginPath();
    this.canvas.moveTo(x + radius, y);
    this.canvas.lineTo(x + width - radius, y);
    this.canvas.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.canvas.lineTo(x + radius, y + radius);
    this.canvas.lineTo(x + radius, y + height);
    this.canvas.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.canvas.lineTo(x, y + radius);
    this.canvas.quadraticCurveTo(x, y, x + radius, y);
    this.canvas.closePath();
    this.canvas.fill();
    // Draw the dark color
    this.canvas.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.canvas.beginPath();
    this.canvas.moveTo(x + width - radius, y);
    this.canvas.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.canvas.lineTo(x + width, y + height - radius);
    this.canvas.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.canvas.lineTo(x + radius , y + height);
    this.canvas.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.canvas.lineTo(x + width - radius , y + height - radius);
    this.canvas.closePath();
    this.canvas.fill();
  }

  public drawTitle(title: string) {
    const {x, y} = this.position;
    const {width, height} = this.dimensions;

    this.canvas.font = '20px Gruppo, sans-serif';
    this.canvas.textAlign = 'center';
    this.canvas.textBaseline = 'middle';
    this.canvas.fillStyle = Colors.ModuleTitle;
    const rectHeight = 40;
    const rectWidth = width;
    const rectX = x;
    const rectY = y;
    this.canvas.fillText(title, rectX + (rectWidth / 2), rectY + (rectHeight / 2));
  }

  public isModuleClicked(xPos: number, yPos: number) {
    const {x, y} = this.position;
    const {width, height} = this.dimensions;
    if (x < xPos && xPos < (x + width)) {
      if (y < yPos && yPos < (y + height)) {
        this.offset = {
          x: xPos - x,
          y: yPos - y,
        };
        return true;
      }
    }
    return false;
  }

  public unSet() {
    this.offset = null;
  }
}
