import { Colors } from '@constants/enums';
import { knobSizes, STEP_KNOB } from '@constants/sizes';
import { SynthModuleControl } from '@interfaces/moduleControl';
import { roundByStepSize } from '@utilities/numeric';
import { ParentModule } from 'src/interfaces';
import { KnobSizeType, KnobType, PositionType } from 'src/types';

export class Knob implements SynthModuleControl {
  public static knobCanvas: CanvasRenderingContext2D;
  protected active: boolean = false;
  private position: PositionType;
  private knobSize: KnobSizeType;
  private canvas: CanvasRenderingContext2D;
  private type: string;
  private mouseStart: PositionType;
  private parent: ParentModule;
  private valueData: any;
  private value: number;
  private label: string;
  private color: string;
  private callback: (value: number) => void;
  private cap: CanvasLineCap;

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
    this.knobSize = knobSizes[control.size];
    this.position = control.position;
    this.valueData = { min, max, log, step };
    this.value = control.value;
    this.label = control.label;
    this.type = control.type;
    this.callback = callback;
    this.color = color;
    this.cap = this.type === STEP_KNOB ? 'butt' : 'round';
  }

  public draw() {
    this.drawKnobRing();
    this.drawKnobBase();
    this.drawKnobValue();
    this.label && this.drawKnobLabel();
  }

  public setValue(value: number) {
    this.value = value;
    this.callback(value);
    this.drawKnobValue();
  }

  public getValue(): number {
    return this.value;
  }

  public drawKnobRing() {
    const {x: xPos, y: yPos} = this.getKnobPosition();

    this.canvas.save();
    this.canvas.beginPath();
    this.canvas.translate(xPos, yPos);
    this.canvas.arc(0, 0, this.knobSize.radius + 7, Math.PI * .75, Math.PI * 2.25);
    this.canvas.strokeStyle = Colors.ControlRing;
    this.canvas.lineWidth = 4;
    this.canvas.lineCap = this.cap;
    this.canvas.stroke();
    this.canvas.restore();
  }

  public drawStepMarkers() {
    const {min, max, step} = this.valueData;
    const {x: xPos, y: yPos} = this.getKnobPosition();
    const steps = (max - min) / step; // Get the number of steps
    const canvas = Knob.knobCanvas;

    canvas.save();
    canvas.lineWidth = 3;
    canvas.strokeStyle = Colors.ModuleBackground;

    for (let i = 0; i <= steps; i++) {
      canvas.save();
      canvas.beginPath();
      canvas.translate(xPos, yPos);
      canvas.rotate(Math.PI * .75 + (Math.PI * 1.5 * i) / steps);
      canvas.moveTo(this.knobSize.radius + 10, 0);
      canvas.lineTo(this.knobSize.radius + 4, 0);
      canvas.stroke();
      canvas.restore();
    }
    canvas.restore();
  }

  public drawKnobBase() {
    const {x: xPos, y: yPos} = this.getKnobPosition();

    this.canvas.save();
    this.canvas.fillStyle = Colors.ControlBackground;
    this.canvas.strokeStyle = Colors.ControlBorder;
    this.canvas.lineWidth = 1;
    this.canvas.beginPath();
    this.canvas.arc(xPos, yPos, this.knobSize.radius - 1, 0, Math.PI * 2, true); // Outer circle
    this.canvas.stroke();
    this.canvas.fill();
    this.canvas.restore();
  }

  public drawKnobValue() {
    const {x: xPos, y: yPos} = this.getKnobPosition();
    const { min, max } = this.valueData;
    const range = max - min;
    const rangeOffset = 0 - min;
    const pos = Math.min(
      ((this.value + rangeOffset) / range) * 1.5 * Math.PI,
      1.5 + Math.PI,
    ) || 0;
    const canvas = Knob.knobCanvas;

    canvas.clearRect(
      xPos - (this.knobSize.radius + 10),
      yPos - (this.knobSize.radius + 10),
      this.knobSize.radius * 2 + 20,
      this.knobSize.radius * 2 + 20,
    );

    canvas.save();
    canvas.beginPath();
    canvas.translate(xPos, yPos);
    canvas.arc(0, 0, this.knobSize.radius + 7, Math.PI * .75, pos + Math.PI * .75);
    canvas.strokeStyle = this.color;
    canvas.lineWidth = 4;
    canvas.lineCap = this.cap;
    canvas.stroke();
    canvas.restore();
    if (this.type === STEP_KNOB) {
      this.drawStepMarkers();
    }

  }

  public drawKnobLabel() {
    const {x: xPos, y: yPos} = this.getKnobPosition();
    const yLabel = yPos + this.knobSize.radius + 6;

    this.canvas.font = '13px Raleway, sans-serif';
    this.canvas.textAlign = 'center';
    this.canvas.textBaseline = 'middle';
    this.canvas.fillStyle = Colors.ControlLabel;
    const rectHeight = 16;
    this.canvas.fillText(this.label, xPos, yLabel + (rectHeight / 2));
  }

  public isControlPressed(xPos: number, yPos: number): boolean {
    const {x: xRotPos, y: yRotPos} = this.getKnobPosition();
    const x = xRotPos - this.knobSize.radius;
    const y = yRotPos - this.knobSize.radius;

    if (x < xPos && xPos < (x + this.knobSize.radius * 3)) {
      if (y < yPos && yPos < (y + this.knobSize.radius * 3)) {
        this.active = true;
        this.mouseStart = {
          x: xPos,
          y: yPos,
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
        requestAnimationFrame(this.drawKnobValue.bind(this, true));
      }
    }
  }

  public isControlReleased(x: number, y: number): boolean {
    const {x: xRotPos, y: yRotPos} = this.getKnobPosition();
    const xPos = xRotPos - this.knobSize.radius;
    const yPos = yRotPos - this.knobSize.radius;

    if (xPos < x && x < (xPos + this.knobSize.radius * 3)) {
      if (yPos < y && y < (yPos + this.knobSize.radius * 3)) {
        this.active = false;
        return true;
      }
    }
    return false;
  }

  public unSet() {
    this.active = false;
  }

  private getKnobPosition(): PositionType {
    const {x: parentX, y: parentY} = this.parent.getPosition();
    return {
      x: this.position.x + parentX,
      y: this.position.y + parentY,
    };
  }
}
