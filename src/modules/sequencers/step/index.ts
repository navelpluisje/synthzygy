import { ButtonGroup, SynthModule, ThreeStateButton } from '@components/index';
import { Slider } from '@components/slider';
import { THREE_STATE_BUTTON, VERTICAL_SLIDER } from '@constants/controlTypes';
import { Colors, Transport } from '@constants/enums';
import { MEDIUM_SLIDER, SMALL_KNOB } from '@constants/sizes';
import { ParentModule } from '@interfaces/index';
import { GateNode } from '@nodes/gateNode';
import { GateTrigger, KnobType, ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../../moduleBase';
import { buttons } from './sequencer.buttons';
import { inputTypes } from './sequencer.inputs';
import { SequencerNode } from './sequencer.node';
import { outputTypes } from './sequencer.outputs';

export class Sequencer extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 170,
    width: 600,
  };
  private static initialValues: ModuleDefaultValues = {
    gates: new Array(16).fill(false, 0, 16),
    stepsA: new Array(16).fill(3, 0, 16),
    stepsB: new Array(16).fill(5, 0, 16),
  };

  public type = 'sequencer';
  public title = 'Sequencer';
  public activeControlGroup: 'A' | 'B' = 'A';
  private node: SequencerNode;
  private stepButtons: ThreeStateButton[] = [];

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues = {},
  ) {
    super(canvas, position, {
      ...Sequencer.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentUtility;
    this.initNode(context, defaults);
    this.container = new SynthModule(canvas, Sequencer.dimensions, position, this.color);
    this.draw();
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addButtonControls();
    this.addStepButtons();
    this.addStepSliders();
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      gates: this.node.getGates(),
      stepsA: this.node.getStepsA(),
      stepsB: this.node.getStepsB(),
    };
  }

  public draw(): void {
    super.draw();
    this.drawStepButtons();
  }

  public handleGroupClick = (group: 'A' | 'B') => {
    this.activeControlGroup = group;
    const stepValues: Float32Array = this.node.getStepValues(group);
    this.controls.forEach((control, index) => control.setValue(stepValues[index]));
    this.draw();
  }

  public onMouseDown(event: MouseEvent): boolean {
    super.onMouseDown(event);

    if (!this.active) {
      return false;
    }
    const {offsetX: xPos, offsetY: yPos} = event;
    this.offset = {
      x: xPos - this.position.x,
      y: yPos - this.position.y,
    };

    this.stepButtons.some((stepButton) => {
      const position = stepButton.isButtonClicked(xPos, yPos);
      if (position) {
        // this.activeOutput = o
        this.drawStepButtons(true);
        return true;
      }
    });
    return true;
  }

  private initNode(context: AudioContext, defaults: ModuleDefaultValues) {
    const initialData = {
      ...this.defaults,
      ...defaults,
    };
    this.node = new SequencerNode(context, this.onStepChange, initialData);
  }

  private getInputConnection = (type: string): GateTrigger => {
    switch (type) {
      case 'gateIn':
        return this.node.inputGate();
      case 'Start/Stop':
        return this.node.cvStartStop(this.setTransportButton);
    }
  }

  private getOutputConnection = (type: string): GateNode | ConstantSourceNode => {
    switch (type) {
      case 'cv A':
        return this.node.outputA();
      case 'cv B':
        return this.node.outputB();
      case 'gateOut':
        return this.node.outputGate();
    }
  }

  private addButtonControls() {
    this.buttons.push(new ButtonGroup(
      this.canvas,
      this,
      buttons[0],
      this.node.handleTransportClick,
      Colors.AccentUtility,
    ));
    this.buttons.push(new ButtonGroup(
      this.canvas,
      this,
      buttons[1],
      this.onRestButtonClick,
      Colors.AccentUtility,
    ));
    this.buttons.push(new ButtonGroup(
      this.canvas,
      this,
      buttons[2],
      this.handleGroupClick,
      Colors.AccentUtility,
    ));
  }

  private onRestButtonClick = () => {
    this.buttons[1].setActiveButton('xx');
    this.node.reset();
  }

  private setTransportButton = (mode: Transport) => {
    switch (mode) {
      case Transport.Stop:
        this.buttons[0].setActiveButton('stop');
        break;
      case Transport.Start:
      case Transport.Continue:
        this.buttons[0].setActiveButton('start');
        break;
    }
    requestAnimationFrame(() => this.buttons[0].draw(true));
  }

  private addStepButtons() {
    const gateData = this.node.getGates();
    for (let i = 0; i < 16; i += 1) {
      const button: KnobType = {
        position: {
          x: 110 + i * 24,
          y: 150,
        },
        size: SMALL_KNOB,
        type: THREE_STATE_BUTTON,
      };
      this.stepButtons.push(new ThreeStateButton(
        this.canvas,
        this,
        button,
        this.setGateValue(i),
        Colors.AccentUtility,
      ));
      this.stepButtons[i].setActive(gateData[i]);
    }
  }

  private addStepSliders() {
    const stepData = this.node.getStepDataByGroupId(this.activeControlGroup);
    for (let i = 0; i < 16; i += 1) {
      const slider: KnobType = {
        log: true,
        max: 8,
        min: 0,
        position: {
          x: 110 + i * 24,
          y: 45,
        },
        showLabel: false,
        size: MEDIUM_SLIDER,
        step: 0.01,
        type: VERTICAL_SLIDER,
        value: stepData[i],
    };
      this.controls.push(new Slider(
        this.canvas,
        this,
        slider,
        this.setStepValue(i),
        Colors.AccentUtility,
      ));
    }
  }

  private onStepChange = (step: number) => {
    this.stepButtons.forEach((button, index) => {
      button.setActiveStep(step === index);
      button.draw(true);
    });
  }

  private setGateValue = (index: number) => (value: boolean) => {
    this.node.setGateStep(index, value);
  }

  private drawStepButtons(overWrite = false): void {
    this.stepButtons.forEach((button) => button.draw(overWrite));
  }

  private setStepValue = (index: number) => (value: number) => {
    this.node.setStepValue(index, this.activeControlGroup, value);
  }
}
