import { Colors } from '@constants/enums';
import { ParentModule } from '@interfaces/index';
import { KnobType, PositionType } from 'src/types';

export class ThreeStateButton {
  private parent: ParentModule;
  private canvas: CanvasRenderingContext2D;
  private color: string;
  private active: boolean = false;
  private activeStep: boolean = false;
  private position: PositionType;
  private size: number = 8;
  private onClick: (val: boolean) => void;

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    button: KnobType,
    onClick: (val: boolean) => void,
    color: string,
  ) {
    this.canvas = canvas;
    this.parent = parent;
    this.position = button.position;
    this.onClick = onClick;
    this.color = color;
  }

  public draw(overWrite = false) {
    const { x, y } = this.getPosition();

    if (overWrite) {
      this.canvas.save();
      this.canvas.beginPath();
      this.canvas.fillStyle = Colors.ModuleBackground;
      this.canvas.arc(x, y, this.size + 2, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.restore();
    }
    this.canvas.save();
    this.canvas.beginPath();
    this.canvas.lineWidth = 2;
    this.canvas.strokeStyle = this.color;
    this.canvas.fillStyle = this.activeStep ? Colors.ControlRing : Colors.TransWhite;
    this.canvas.arc(x, y, this.size, 0, 2 * Math.PI);
    this.canvas.fill();
    this.canvas.stroke();
    this.canvas.restore();
    if (this.active) {
      this.canvas.save();
      this.canvas.beginPath();
      this.canvas.fillStyle = this.color;
      this.canvas.arc(x, y, 4, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.restore();
    }
  }

  public getPosition(): PositionType {
    const { x, y } = this.position;
    const { x: parX, y: parY} = this.parent.getPosition();

    return {
      x: x + parX,
      y: y + parY,
    };
  }

  public setActive(active: boolean): void {
    this.active = active;
    this.draw(true);
  }

  public getActive(): boolean {
    return this.active;
  }

  public setActiveStep(active: boolean): void {
    this.activeStep = active;
  }

  public isControlClicked(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition();

    if (xPos > x - this.size  && xPos < x + this.size) {
      if (yPos > y - this.size  && yPos < y + this.size) {
        this.active = !this.active;
        this.onClick(this.active);
        return true;
      }
    }
    return false;
  }

  public unSet() {
    // this.active = false
  }
}
