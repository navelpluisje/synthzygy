import { ButtonGroup, SynthModule, ThreeStateButton } from '@components/index';
import { THREE_STATE_BUTTON } from '@constants/controlTypes';
import { Colors, Transport } from '@constants/enums';
import { SMALL_KNOB } from '@constants/sizes';
import { ParentModule } from '@interfaces/index';
import { GateTrigger, KnobType, ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../../moduleBase';
import { buttons } from './sequencer.buttons';
import { inputTypes } from './sequencer.inputs';
import { knobTypes } from './sequencer.knobs';
import { SequencerNode } from './sequencer.node';
import { outputTypes } from './sequencer.outputs';
import { CurrentSteps, StepGroup, StepId, Steps } from './types';

type X = [string, StepGroup];

export class TriggerSequencer extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 300,
    width: 420,
  };
  private static initialValues: ModuleDefaultValues = {
    length: 16,
    steps1: new Array(16).fill(false, 0, 16),
    steps2: new Array(16).fill(false, 0, 16),
    steps3: new Array(16).fill(false, 0, 16),
    [StepId.ONE]: 1,
    [StepId.TWO]: 1,
    [StepId.THREE]: 1,
  };

  public type = 'trigger-sequencer';
  public title = 'Trigger Sequencer';
  private node: SequencerNode;
  private stepsCirclePosition: PositionType = {
    x: 200,
    y: 164,
  };
  private steps: Steps = {
    [StepId.ONE]: {
      positions: [],
      threeStateButtons: [],
    },
    [StepId.TWO]: {
      positions: [],
      threeStateButtons: [],
    },
    [StepId.THREE]: {
      positions: [],
      threeStateButtons: [],
    },
  };

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues = {},
  ) {
    super(canvas, position, {
      ...TriggerSequencer.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentUtility;
    this.initNode(context, defaults);
    this.container = new SynthModule(canvas, TriggerSequencer.dimensions, position, this.color);
    this.calculateStepPositions();
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
    this.addButtonControls();
    this.addStepButtons();
    this.draw();
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      // gates: this.node.getGates(),
      // length: this.node.getLength(),
      // stepsA: this.node.getStepsA(),
      // stepsB: this.node.getStepsB(),
    };
  }

  public draw(): void {
    super.draw();
    this.drawCirclesAndLines();
    this.drawStepButtons();
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

    Object.values(this.steps).some(({ threeStateButtons }: StepGroup) => {
      return threeStateButtons.some((stepButton: ThreeStateButton) => {
        const isClicked = stepButton.isButtonClicked(xPos, yPos);
        if (isClicked) {
          this.drawStepButtons(true);
          return true;
        }
      });
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

  private getInputConnection = (type: string): GateTrigger | GainNode => {
    switch (type) {
      case 'gateIn':
        return this.node.inputGate();
      case 'Start/Stop':
        return this.node.cvStartStop(this.setTransportButton);
    }
  }

  private getOutputConnection = (type: string): ConstantSourceNode => {
    switch (type) {
      case 'gate-1':
        return this.node.outputGate(StepId.ONE);
      case 'gate-2':
        return this.node.outputGate(StepId.TWO);
      case 'gate-3':
        return this.node.outputGate(StepId.THREE);
      case 'gateXor':
        return this.node.outputGate('xor');
      case 'gateAnd':
        return this.node.outputGate('and');
    }
  }

  private getKnobCallbackAndDefault = (label: string) => {
    const key = label.toLowerCase();
    switch (key) {
      case 'length':
        return {
          callback: this.node.setLength,
          default: this.defaults[key],
        };
      case '1':
        return {
          callback: this.node.setStepLength(StepId.ONE),
          default: this.defaults[StepId.ONE],
        };
      case '2':
        return {
          callback: this.node.setStepLength(StepId.TWO),
          default: this.defaults[StepId.TWO],
        };
      case '3':
        return {
          callback: this.node.setStepLength(StepId.THREE),
          default: this.defaults[StepId.THREE],
        };
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
    Object.values(this.steps).forEach(({threeStateButtons, positions}, group) => {
      for (let i = 0; i < 16; i += 1) {
        const button: KnobType = {
          position: {
            x: positions[i].x,
            y: positions[i].y,
          },
          size: SMALL_KNOB,
          type: THREE_STATE_BUTTON,
        };
        threeStateButtons.push(new ThreeStateButton(
          this.canvas,
          this,
          button,
          this.setGateValue(group + 1, i),
          Colors.AccentUtility,
        ));
        // this.stepButtons[i].setActive(gateData[i]);
      }
    });
  }

  private onStepChange = (step: CurrentSteps): void => {
    const steps: X[] = Object.entries(this.steps);
    steps.forEach(([key, { threeStateButtons }]: X) => {
      threeStateButtons.forEach((button, index) => {
        // @ts-ignore
        button.setActiveStep(step[key] === index);
        button.draw(true);
      });
    });
  }

  private setGateValue = (group: number, index: number) => (value: boolean) => {
    this.node.setGateStep(group, index, value);
  }

  private getCircleCenter() {
    const { x: circleX, y: circleY } = this.stepsCirclePosition;
    const { x: parentX, y: parentY } = this.getPosition();
    const centerX = circleX + parentX;
    const centerY = circleY + parentY;

    return{
      centerX,
      centerY,
    };
  }

  private calculateStepPositions() {
    const {x: centerX, y: centerY } = this.stepsCirclePosition;

    for (let i = 1; i < 17; i += 1) {
      this.steps[StepId.ONE].positions.push({
        x: centerX + 66 * Math.cos(Math.PI / 8 * i),
        y: centerY + 66 * Math.sin(Math.PI / 8 * i),
      });
      this.steps[StepId.TWO].positions.push({
        x: centerX + 91 * Math.cos(Math.PI / 8 * i),
        y: centerY + 91 * Math.sin(Math.PI / 8 * i),
      });
      this.steps[StepId.THREE].positions.push({
        x: centerX + 116 * Math.cos(Math.PI / 8 * i),
        y: centerY + 116 * Math.sin(Math.PI / 8 * i),
      });
    }
  }

  private drawCirclesAndLines() {
    const {centerX, centerY } = this.getCircleCenter();
    const { x, y } = this.getPosition();

    this.canvas.save();
    this.canvas.strokeStyle = Colors.AccentUtility;
    this.canvas.beginPath();
    this.canvas.arc(centerX, centerY, 116, 0, 2 * Math.PI);
    this.canvas.stroke();
    this.canvas.beginPath();
    this.canvas.arc(centerX, centerY, 91, 0, 2 * Math.PI);
    this.canvas.stroke();
    this.canvas.beginPath();
    this.canvas.arc(centerX, centerY, 66, 0, 2 * Math.PI);
    this.canvas.stroke();
    this.canvas.setLineDash([5, 5]);

    for (let i = 0; i < 16; i += 1) {
      this.canvas.beginPath();
      this.canvas.moveTo(
        this.steps[StepId.TWO].positions[i].x + x,
        this.steps[StepId.TWO].positions[i].y + y,
      );
      this.canvas.lineTo(centerX, centerY);
      this.canvas.stroke();
    }
    this.canvas.restore();
    this.controls.length && this.controls[0].draw();
  }

  private drawStepButtons(overWrite = false): void {
    this.steps[StepId.ONE].threeStateButtons.forEach((button) => button.draw(overWrite));
    this.steps[StepId.TWO].threeStateButtons.forEach((button) => button.draw(overWrite));
    this.steps[StepId.THREE].threeStateButtons.forEach((button) => button.draw(overWrite));
  }

  // private setStepValue = (index: number) => (value: number) => {
  //   this.node.setStepValue(index, this.activeControlGroup, value);
  // }
}
