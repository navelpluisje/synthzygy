import { ParentModule } from '@interfaces/index';
import { fillRoundedRect, strokeRoundedRect } from '@utilities/roundedRect';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';

export interface ButtonGroup {
  draw(overwrite?: boolean): void;
  isButtonClicked(xPos: number, yPos: number): void;
  setActiveButton(active: string | null): void;
}

interface ModuleButtonType {
  label: string;
  value: string;
}

type DirectionType = 'vertical' | 'horizontal';

export type ModuleButtonsList = ModuleButtons[];

export interface ModuleButtons {
  position: PositionType;
  dimensions: DimensionType;
  direction: DirectionType;
  active: string;
  buttons: ModuleButtonType[];
}

export class ButtonGroup implements ButtonGroup {
  public parent: ParentModule;
  public canvas: CanvasRenderingContext2D;
  public color: string;
  public buttons: ModuleButtonType[];
  public activeButton: string | null;
  public position: PositionType;
  public callback: (button: string) => void;
  public buttonDimension: DimensionType;
  public direction: DirectionType;
  public isToggle: boolean;

  constructor(
    canvas: CanvasRenderingContext2D,
    parent: ParentModule,
    buttons: ModuleButtons,
    callback: (button: string) => void,
    color: string,
    isToggle: boolean = false,
  ) {
    this.canvas = canvas;
    this.parent = parent;
    this.color = color;
    this.buttons = buttons.buttons;
    this.position = buttons.position;
    this.activeButton = buttons.active;
    this.direction = buttons.direction;
    this.buttonDimension = buttons.dimensions;
    this.callback = callback;
    this.isToggle = isToggle;
  }

  public getRadius(index: number): number | {} {
    const length = this.buttons.length - 1;
    if (length === 0) {
      return 5;
    }
    if (index === 0) {
      return this.direction === 'vertical'
        ? {tl: 5, tr: 5, br: 0, bl: 0}
        : {tl: 5, tr: 0, br: 0, bl: 5};
    }
    if (index === length) {
      return this.direction === 'vertical'
        ? {tl: 0, tr: 0, br: 5, bl: 5}
        : {tl: 0, tr: 5, br: 5, bl: 0};
    }
    return 0;
  }

  public draw(overwrite?: boolean) {
    const { x, y } = this.getPosition();
    const {width, height} = this.buttonDimension;
    let buttonX = x;
    let buttonY = y;

    if (overwrite) {
      this.canvas.save();
      this.canvas.fillStyle = Colors.ModuleBackground;
      this.canvas.fillRect(x - 1 , y - 1, width + 2, height * this.buttons.length + 2);
      this.canvas.restore();
    }

    this.canvas.save();
    this.canvas.strokeStyle = Colors.ModuleBackground;
    this.canvas.fillStyle = Colors.ControlBackground;
    this.canvas.font = '12px Raleway, sans-serif';
    this.canvas.textAlign = 'center';
    this.canvas.textBaseline = 'middle';
    this.canvas.fillStyle = Colors.ControlLabel;

    this.buttons.forEach((button, index) => {
      if (this.direction === 'vertical') {
        buttonY = y + index * height;
      } else {
        buttonX = x + index * width;
      }
      const radius = this.getRadius(index);
      this.canvas.beginPath();
      if (this.activeButton === button.value) {
        this.canvas.fillStyle = this.color;
      } else {
        this.canvas.fillStyle = Colors.ControlBackground;
      }
      fillRoundedRect(this.canvas, buttonX, buttonY, width, height, radius);
      strokeRoundedRect(this.canvas, buttonX, buttonY, width, height, radius);

      this.canvas.save();
      this.canvas.beginPath();
      this.canvas.fillStyle = Colors.ControlLabel;
      this.canvas.shadowOffsetX = .5;
      this.canvas.shadowOffsetY = .5;
      this.canvas.shadowBlur = 1;
      this.canvas.shadowColor = Colors.ModuleBackground;
      this.canvas.fillText(button.label, buttonX + width / 2, buttonY + height / 2);
      this.canvas.restore();
    });
    this.canvas.restore();
  }

  public getPosition(): PositionType {
    const { x: parX, y: parY } = this.parent.getPosition();
    const { x, y } = this.position;

    return {
      x: x + parX,
      y: y + parY,
    };
  }

  public isButtonClicked(xPos: number, yPos: number): void {
    const { x, y } = this.getPosition();
    const {width, height} = this.buttonDimension;
    let buttonX = x;
    let buttonY = y;

    this.buttons.some((button, index) => {
      if (this.direction === 'vertical') {
        buttonY = y + index * height;
      } else {
        buttonX = x + index * width;
      }

      if (xPos > buttonX  && xPos < buttonX + width) {
        if (yPos > buttonY  && yPos < buttonY + height) {
          if (this.isToggle && this.activeButton === button.value) {
            this.activeButton = null;
          } else {
            this.activeButton = button.value;
          }
          requestAnimationFrame(this.draw.bind(this, true));
          this.callback(this.activeButton);
          return true;
        }
      }
    });
  }

  public setActiveButton(active: string | null): void {
    this.activeButton = active;
  }

  public unSet() {
    // this.active = false
  }
}
