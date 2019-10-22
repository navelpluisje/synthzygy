import { Colors } from '@constants/enums';
import { knobSizes } from '@constants/sizes';
import { ParentModule } from '@interfaces/index';
import { SynthModuleControl } from '@interfaces/moduleControl';
import { KnobType, PositionType } from 'src/types';
import { drawIcon } from './icons';

export class TriggerButton implements SynthModuleControl {
  public onPress: () => void;
  public onRelease: () => void;
  private parent: ParentModule;
  private canvas: CanvasRenderingContext2D;
  private color: string;
  private active: boolean = false;
  private position: PositionType;
  private size: number;

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    button: KnobType,
    onPress: () => void,
    onRelease: () => void,
    color: string,
  ) {
    this.canvas = canvas;
    this.parent = parent;
    this.position = button.position;
    this.size = knobSizes[button.size].radius;
    this.onPress = onPress;
    this.onRelease = onRelease;
    this.color = color;
  }

  public draw(redraw: boolean = false) {
    const { x, y } = this.getPosition();

    this.canvas.save();
    if (redraw) {
      this.canvas.beginPath();
      this.canvas.strokeStyle = Colors.ModuleBackground;
      this.canvas.fillStyle = Colors.ModuleBackground;
      this.canvas.arc(x - 1, y - 1, this.size + 2, 0, 2 * Math.PI);
      this.canvas.fill();
      this.canvas.stroke();
    }
    this.canvas.beginPath();
    this.canvas.strokeStyle = Colors.ControlLabel;
    this.canvas.fillStyle = this.active ? this.color : Colors.ControlBackground;
    this.canvas.arc(x, y, this.size, 0, 2 * Math.PI);
    this.canvas.fill();
    this.canvas.stroke();
    drawIcon(this.canvas, 'gate', this.getPosition(), 'white');
    this.canvas.restore();
  }

  public getPosition(): PositionType {
    const { x, y } = this.position;
    const { x: parX, y: parY} = this.parent.getPosition();

    return {
      x: x + parX,
      y: y + parY,
    };
  }

  public isControlPressed(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition();

    if (xPos > x - this.size  && xPos < x + this.size) {
      if (yPos > y - this.size  && yPos < y + this.size) {
        this.active = true;
        this.draw(true);
        this.onPress();
        return true;
      }
    }
    return false;
  }

  public isControlReleased(xPos: number, yPos: number): boolean {
    if (this.active) {
      this.active = false;
      this.draw(true);
      this.onRelease();
      return true;
    }
    return false;
  }

  public onMouseMove(event: MouseEvent): void {
    // Interface happy
  }

  public setValue(value: number): void {
    // Interface happy
  }

  public unSet() {
    // this.active = false
  }
}
