import { ButtonGroup, Knob, TriggerButton } from '@components/index';
import { Slider } from '@components/slider';
import { SynthModule } from '@components/synthModule';
import { Module } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { DimensionType, InputType, OutputType, PositionType } from 'src/types';

export class ModuleBase implements Module {
  protected title = 'title';
  protected inputs: InputType[] = [];
  protected outputs: OutputType[] = [];
  protected controls: Array<Knob | TriggerButton | Slider> = [];
  protected buttons: ButtonGroup[] = [];
  protected activeOutput: OutputType = null;
  protected activeInput: InputType = null;
  protected activeControl: number | null = null;
  protected active: boolean = false;
  protected deleteAreaClicked: boolean = false;
  protected position: PositionType;
  protected offset: PositionType;
  protected canvas: CanvasRenderingContext2D;
  protected container: SynthModule;
  protected color = Colors.ModuleBackground;
  protected type: string = '';
  protected id: string = '';

  constructor(canvas: CanvasRenderingContext2D, position: PositionType) {
    this.position = position;
    this.canvas = canvas;
    this.draw.bind(this);
  }

  public draw(): void {
    this.container.draw();
    this.container.drawTitle(this.title);
    this.inputs.length && this.inputs.forEach((input) => input.component.draw());
    this.outputs.length && this.outputs.forEach((output) => output.component.draw());
    this.controls.length && this.controls.forEach((control) => control.draw());
    this.buttons.length && this.buttons.forEach((button) => button.draw());
  }

  public getSelectedInput(event: MouseEvent): InputType | null {
    const { offsetX, offsetY } = event;
    this.inputs.some((input) => {
      const position = input.component.isInputClicked(offsetX, offsetY);
      if (position) {
        this.activeInput = input;
        return true;
      }
    });

    return this.activeInput;
  }

  public onMouseDown(event: MouseEvent): boolean {
    const {offsetX: xPos, offsetY: yPos} = event;
    this.deleteAreaClicked = false;
    this.active = this.container.isModuleClicked(xPos, yPos);
    this.offset = {
      x: xPos - this.position.x,
      y: yPos - this.position.y,
    };

    if (this.offset.y < 40) {
      this.deleteAreaClicked = true;
    }

    this.outputs.some((output) => {
      const position = output.component.isOutputClicked(xPos, yPos);
      if (position) {
        this.activeOutput = output;
        return true;
      }
    });

    if (this.activeOutput === null) {
      this.controls.some((control, index) => {
        const clicked = control.isControlPressed(xPos, yPos);
        if (clicked) {
          this.activeControl = index;
        }
        return clicked;
      });
    }

    return this.active;
  }

  public onMouseMove(event: MouseEvent): void {
    if (!this.active) { return; }
    if (this.activeControl !== null) {
      this.controls[this.activeControl].onMouseMove(event);
      requestAnimationFrame(this.draw.bind(this));
    } else if (this.activeOutput === null) {

      this.position.x = event.offsetX - this.offset.x;
      this.position.y = event.offsetY - this.offset.y;
    }
  }

  public onMouseUp(event: MouseEvent): void {
    const { offsetX, offsetY } = event;
    this.controls.forEach((control, index) => {
      control.isControlReleased(offsetX, offsetY);
      this.activeControl = null;
    });
    this.unset();
  }

  public onMouseClick(event: MouseEvent): void {
    const {offsetX, offsetY} = event;
    this.buttons.forEach((control, index) => {
       control.isButtonClicked(offsetX, offsetY);
    });
    this.unset();
  }

  public isDeleteAreaClicked(): boolean {
    return this.deleteAreaClicked;
  }

  public getPosition(): PositionType {
    return this.position;
  }

  public getDimensions(): DimensionType {
    // this way we can read static properties from the child class
    // @ts-ignore
    return this.constructor.dimensions;
  }

  public getOffset(): PositionType {
    return this.offset;
  }

  public getActiveOutput(): OutputType {
    return this.activeOutput;
  }

  public hasActiveOutput(): boolean {
    return this.activeOutput !== null;
  }

  public getActiveInput(): InputType {
    return this.activeInput;
  }

  public getActiveControl(): number {
    return this.activeControl;
  }

  public hasActiveControl(): boolean {
    return this.activeControl !== null;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getType() {
    return this.type;
  }

  public unset() {
    this.active = false;
    this.activeOutput = null;
    this.activeControl = null;
    this.container.unSet();
  }
}
