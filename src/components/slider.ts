import { Colors } from '@constants/enums';
import { sliderSizes } from '@constants/sizes';
import { SynthModuleControl } from '@interfaces/moduleControl';
import { roundByStepSize } from '@utilities/numeric';
import { ParentModule } from 'src/interfaces';
import { KnobType, PositionType } from '../types';

export class Slider implements SynthModuleControl {
  public static knobCanvas: CanvasRenderingContext2D;
  private position: PositionType;
  private canvas: CanvasRenderingContext2D;
  private active: boolean = false;
  private mouseStart: PositionType;
  private parent: ParentModule;
  private valueData: any;
  private value: number;
  private label: string;
  private color: string;
  private size: number;
  private callback: (value: number) => void;

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    control: KnobType,
    callback: (value: number) => void,
    color: string = 'red',
  ) {
    const { min, max, log, step } = control;
    this.canvas = canvas;
    this.parent = parent;
    this.position = control.position;
    this.valueData = { min, max, log, step };
    this.value = control.value;
    this.label = control.label;
    this.callback = callback;
    this.color = color;
    this.size = sliderSizes[control.size];
  }

  public draw() {
    this.clearSlider();
    this.drawSliderBase();
    this.drawSliderValue();
    this.drawSliderCap();
    this.label && this.drawKnobLabel();
  }

  public setValue(value: number) {
    this.value = value;
    this.callback(this.value);
  }

  public getValue(): number {
    return this.value;
  }

  public isActive(): boolean {
    return this.active;
  }

  public isControlPressed(xPos: number, yPos: number): boolean {
    const {x, y} = this.getSliderPosition();
    const capPosition = y + this.size - this.getValuePosition();

    const xCap = x - 10;
    const yCap = capPosition - 10;

    if (xCap < xPos && xPos < (xCap + 20)) {
      if (yCap < yPos && yPos < (yCap + 20)) {
        this.active = true;
        this.mouseStart = {
          x,
          y,
        };
        return true;
      }
    }
    return false;
  }

  public onMouseMove(event: MouseEvent): void {
    let newValue = 0;
    const {min, max, log, step} = this.valueData;
    const steps = (max - min) / step; // Get the number of steps
    let stepSize = 1;
    let logSize = 1;
    if (steps < 100) {
      stepSize = 100 / steps;
    }
    if (steps > 5000) {
      logSize = 2;
    }
    // TODO: Optimize the value calculation
    const mouseOffset = this.mouseStart.y - event.offsetY;

    // If no mouseoffset, there is no change, so skip it
    if (mouseOffset !== 0 && mouseOffset >= stepSize || mouseOffset <= stepSize) {
      if (log) {
        newValue = this.value + (mouseOffset / stepSize) * step * (Math.abs(event.movementY) ** logSize || 1);
      } else {
        newValue = this.value + (mouseOffset / stepSize) * step;
      }

      // Get the rounded new Value
      newValue = roundByStepSize(
        Math.max(
          Math.min(
            newValue,
            max,
          ),
          min,
        ),
        step || 0.1,
      );
      // If the value did not change, do not do a thing
      if (this.value !== newValue) {
        this.value = newValue;
        this.mouseStart.y = event.offsetY;
        this.callback(this.value);
        requestAnimationFrame(this.draw.bind(this));
      }
    }
  }

  public isControlReleased(x: number, y: number): boolean {
    if (this.active) {
      this.active = false;
      return true;
    }
    return false;
  }

  public unSet() {
    this.active = false;
  }

  private clearSlider(): void {
    const {x: xPos, y: yPos} = this.getSliderPosition();

    Slider.knobCanvas.clearRect(xPos - 10, yPos - 10, 20, this.size + 20);
  }

  private drawSliderBase() {
    const {x: xPos, y: yPos} = this.getSliderPosition();
    const canvas = Slider.knobCanvas;

    canvas.save();
    canvas.strokeStyle = Colors.ControlRing;
    canvas.lineWidth = 10;
    canvas.lineCap = 'round';
    canvas.beginPath();
    canvas.moveTo(xPos, yPos);
    canvas.lineTo(xPos, yPos + this.size);
    canvas.stroke();
    canvas.fill();
    canvas.restore();
  }

  private drawSliderValue() {
    const {x: xPos, y: yPos} = this.getSliderPosition();
    const canvas = Slider.knobCanvas;
    const valuePosition = this.getValuePosition();

    canvas.save();
    canvas.strokeStyle = this.color;
    canvas.lineWidth = 10;
    canvas.lineCap = 'round';
    canvas.beginPath();
    canvas.moveTo(xPos, yPos + this.size);
    canvas.lineTo(xPos, (yPos + this.size - valuePosition));
    canvas.stroke();
    canvas.fill();
    canvas.restore();
  }

  private drawSliderCap() {
    const {x: xPos, y: yPos} = this.getSliderPosition();
    const canvas = Slider.knobCanvas;
    const valuePosition = this.getValuePosition();

    canvas.save();
    canvas.strokeStyle = Colors.ControlBorder;
    canvas.fillStyle = Colors.ControlBackground;
    canvas.lineWidth = 2;
    canvas.beginPath();
    canvas.arc(xPos, (yPos + this.size - valuePosition), 8, 0, Math.PI * 2);
    canvas.stroke();
    canvas.fill();
    canvas.restore();
  }

  private drawKnobLabel() {
    const {x: xPos, y: yPos} = this.getSliderPosition();
    const yLabel = yPos + 36;

    this.canvas.font = '13px Raleway, sans-serif';
    this.canvas.textAlign = 'center';
    this.canvas.textBaseline = 'middle';
    this.canvas.fillStyle = Colors.ControlLabel;
    const rectHeight = 16;
    this.canvas.fillText(this.label, xPos, yLabel + (rectHeight / 2));
  }

  private getValuePosition(): number {
    const { min, max } = this.valueData;
    const relativeValue = this.value / (max - min);
    return this.size * relativeValue;
  }

  private getSliderPosition(): PositionType {
    const {x: parentX, y: parentY} = this.parent.getPosition();
    return {
      x: this.position.x + parentX,
      y: this.position.y + parentY,
    };
  }
}
