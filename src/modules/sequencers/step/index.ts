import { ButtonGroup, InputConnector, OutputConnector, Knob, SynthModule, ThreeStateButton } from '@components/index';
import { Colors, Transport } from '@constants/enums';
import { SMALL_KNOB } from '@constants/sizes';
import { Module, ParentModule } from '@interfaces/index';
import { GateNode } from '@nodes/gateNode';
import { ControlType, GateTrigger, PositionType } from 'src/types';
import { ModuleBase } from '../../moduleBase';
import { buttons } from './buttons';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { SequencerNode } from './sequencer.node';

export interface Sequencer extends Module {
  getNode(): SequencerNode;
}

export class Sequencer extends ModuleBase implements Sequencer, ParentModule {
  public static dimensions = {
    height: 170,
    width: 600,
  };

  public type = 'sequencer';
  public title = 'Sequencer';
  public active: boolean = false;
  public activeControlGroup: 'A' | 'B' = 'A';
  public node: SequencerNode;
  public stepButtons: ThreeStateButton[] = [];

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new SequencerNode(context, this.onStepChange);
    this.container = new SynthModule(canvas, Sequencer.dimensions, position, this.color);
    this.draw.bind(this);
    this.addOutputs();
    this.addInputs();
    this.addControls();
    this.addButtonControls();
    this.addStepButtons();
  }

  public draw = (): void => {
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
      const position = stepButton.isControlClicked(xPos, yPos);
      if (position) {
        // this.activeOutput = o
        this.drawStepButtons(true);
        return true;
      }
    });
    return true;
  }

  public getNode(): SequencerNode {
    return this.node;
  }

  private addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentUtility);
      this.inputs.push({
        component,
        gate: this.getInputConnection(input.name),
        type: input.type,
      });
    });
  }

  private getInputConnection(type: string): GateTrigger {
    switch (type) {
      case 'gateIn':
        return this.node.inputGate();
      case 'Start/Stop':
        return this.node.cvStartStop(this.setTransportButton);
    }
  }

  private addOutputs() {
    outputTypes.forEach((output) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility);
      const key = output.type === 'gate' ? 'gate' : 'node';
      this.outputs.push({
        component,
        type: output.type,
        [key]: this.getOutputConnection(output.name),
      });
    });
  }

  private getOutputConnection(type: string): GateNode | ConstantSourceNode {
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
    for (let i = 0; i < 16; i += 1) {
      const button: ControlType = {
        position: {
          x: 120 + i * 22.5,
          y: 150,
        },
        size: SMALL_KNOB,
        type: 'stepButton',
    };
      this.stepButtons.push(new ThreeStateButton(
        this.canvas,
        this,
        button,
        this.setGateValue(i),
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

  private addControls() {
    for (let i = 0; i < 16; i += 1) {
      this.controls.push(new Knob(this.canvas, this, controlTypes[i], this.setStepValue(i), Colors.AccentUtility));
    }
  }
}
