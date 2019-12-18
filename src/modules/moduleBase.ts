import { ButtonGroup, InputConnector, Knob, OutputConnector, ThreeStateButton, TriggerButton } from '@components/index';
import { Label } from '@components/label';
import { Slider } from '@components/slider';
import { SynthModule } from '@components/synthModule';
import { Module } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import {
  DimensionType,
  GateTrigger,
  InputType,
  KnobType,
  LabelType,
  ModuleDefaultValues,
  OutputType,
  PositionType,
  SynthConnectorType,
} from 'src/types';
import { MidiNode } from './midi/midi.node';

export class ModuleBase implements Module {
  protected title = 'title';
  protected inputs: InputType[] = [];
  protected outputs: OutputType[] = [];
  protected controls: Array<Knob | TriggerButton | Slider> = [];
  protected buttons: Array<ButtonGroup | ThreeStateButton> = [];
  protected labels: Label[] = [];
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
  protected accentColor = 'white';
  protected type: string = '';
  protected defaults: ModuleDefaultValues;
  protected id: string = '';

  constructor(canvas: CanvasRenderingContext2D, position: PositionType, defaults?: ModuleDefaultValues) {
    this.defaults = {
      ...this.defaults,
      ...defaults,
    };
    this.id = this.defaults.id as string;
    this.position = position;
    this.canvas = canvas;
    this.draw = this.draw.bind(this);
  }

  public getModuleData() {
    // dummy method
  }

  public draw(): void {
    this.container.draw();
    this.container.drawTitle(this.title);
    this.inputs.length && this.inputs.forEach((input) => input.component.draw());
    this.outputs.length && this.outputs.forEach((output) => output.component.draw());
    this.controls.length && this.controls.forEach((control) => control.draw());
    this.buttons.length && this.buttons.forEach((button) => button.draw());
    this.labels.length && this.labels.forEach((label) => label.draw());
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
      requestAnimationFrame(this.draw);
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

  public getType(): string {
    return this.type;
  }

  public unset(): void {
    this.active = false;
    this.activeOutput = null;
    this.activeControl = null;
    this.container.unSet();
  }

  public getInputDataByName(name: string) {
    return this.inputs.find((input) => input.name === name);
  }

  public getOutputDataByName(name: string) {
    return this.outputs.find((output) => output.name === name);
  }

  protected addInputs(
    inputTypes: SynthConnectorType[],
    getInputConnection: (type: string) => GateTrigger | AudioNode | AudioParam,
  ): void {
    inputTypes.forEach((input) => {
      const component = new InputConnector(this.canvas, this, input, this.accentColor);
      const key = input.type === 'data' ? 'data' : 'node';

      this.inputs.push({
        component,
        [key]: getInputConnection(input.name),
        module: this.id,
        name: input.name,
        type: input.type,
      });
    });
  }

  protected addOutputs(
    outputTypes: SynthConnectorType[],
    getOutputConnection?: (type: string) => AudioNode | MidiNode | {},
  ): void {
    outputTypes.forEach((output) => {
      const component = new OutputConnector(this.canvas, this, output, this.accentColor);
      const key = output.type === 'data' ? 'data' : 'node';

      this.outputs.push({
        component,
        [key]: getOutputConnection(output.name),
        module: this.getId(),
        name: output.name,
        type: output.type,
      });
    });
  }

  protected addLabels(
    labels: LabelType[],
  ): void {
    labels.forEach((lbl) => {
      const label = new Label(this.canvas, this, lbl);
      this.labels.push(label);
    });
  }

  protected addKnobs(
    knobs: KnobType[],
    getKnobCallbackAndDefault: any,
  ): void {
    knobs.forEach((knobData) => {
      const callback = getKnobCallbackAndDefault(knobData.label);
      const knob = new Knob(this.canvas, this, knobData, callback.callback, this.accentColor);
      knob.setValue(callback.default);
      this.controls.push(knob);
    });
  }

  protected getKnobByIndex(index: number) {
    return this.controls[index];
  }

  protected addSliders(
    sliders: KnobType[],
    getSliderCallbackAndDefault: any,
  ): void {
    sliders.forEach((sliderData) => {
      const callback = getSliderCallbackAndDefault(sliderData.label);
      const slider = new Slider(this.canvas, this, sliderData, callback.callback, this.accentColor);
      slider.setValue(callback.default);
      this.controls.push(slider);
    });
  }
}
