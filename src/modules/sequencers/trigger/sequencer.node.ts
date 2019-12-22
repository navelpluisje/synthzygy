import { Transport } from '@constants/enums';
import { GateInputNode } from '@nodes/gateInputNode';
import { GateOutputNode } from '@nodes/gateOutputNode';
import { GateTrigger, ModuleDefaultValues } from 'src/types';
import { CurrentSteps, StepId } from './types';

interface GateGroup {
  stepLength: number;
  values: boolean[];
  currentStep: number;
  currentStepProgress: number;
}

export class SequencerNode {
  private gates: Record<number, GateGroup> = {
    [StepId.ONE]: {
      currentStep: -1,
      currentStepProgress: 0,
      stepLength: 1,
      values: [],
    },
    [StepId.TWO]: {
      currentStep: -1,
      currentStepProgress: 0,
      stepLength: 1,
      values: [],
    },
    [StepId.THREE]: {
      currentStep: -1,
      currentStepProgress: 0,
      stepLength: 1,
      values: [],
    },
  };
  private length: number;
  private running: boolean = false;
  private context: AudioContext;
  private gateOutputs: Record<string, GateOutputNode>;
  private gateInput: GateInputNode;
  private transportCallback: GateTrigger;
  private stepChangeCallback: (step: CurrentSteps) => void;

  constructor(
    context: AudioContext,
    stepChangeCallback: (step: CurrentSteps) => void,
    initialData: ModuleDefaultValues,
  ) {
    this.context = context;
    this.setGates(initialData.steps1 as boolean[], 1);
    this.setGates(initialData.steps2 as boolean[], 2);
    this.setGates(initialData.steps3 as boolean[], 3);
    this.gateInput = new GateInputNode(this.context, this.trigger);
    this.createOutputNodes();
    this.stepChangeCallback = stepChangeCallback;
  }

  public setLength = (length: number): void => {
    this.length = length;
  }

  public setStepLength(groupId: StepId) {
    return (length: number) => {
      if (this.gates[groupId].currentStepProgress >= length) {
        this.gates[groupId].currentStepProgress = 0;
      }
      this.gates[groupId].stepLength = length;
    };
  }

  public getLength(): number {
    return this.length;
  }

  public getStepDataByGroupId(groupId: StepId): number {
    return this.gates[groupId].currentStep;
  }

  public setGates(values: boolean[], group: StepId): void {
    this.gates[group].values = values;
  }

  public getGates(): Record<number, GateGroup> {
    return this.gates;
  }

  public start(): void {
    this.running = true;
  }

  public stop(): void {
    this.running = false;
  }

  public reset(): void {
    Object.values(this.gates).forEach((gate) => {
      gate.currentStep = -1;
    });
  }

  public setGateStep(group: StepId, index: number, value: boolean) {
    this.gates[group].values[index] = value;
  }

  public handleTransportClick = (value: string) => {
    switch (value) {
      case 'start':
        this.start();
        break;
      case 'stop':
        this.stop();
        break;
      case 'reset':
        this.reset();
        break;
      default:
        console.warn(`Invalid value (${value}) given for 'handleTransportClick'. Should be: start, stop or reset`);
    }
  }

  public triggerTransport = (mode: Transport) => {
    switch (mode) {
      case Transport.Stop:
        this.stop();
        break;
      case Transport.Start:
        this.reset();
        this.start();
        break;
      case Transport.Continue:
        this.start();
        break;
    }
    this.transportCallback(mode);
  }

  public getStepValues(group: StepId): boolean[] {
    return this.gates[group].values;
  }

  public cvStartStop(transportCallback: GateTrigger): GateTrigger {
    this.transportCallback = transportCallback;
    return this.triggerTransport;
  }

  public inputGate(): GainNode {
    return this.gateInput.input();
  }

  public outputGate(key: string | StepId): ConstantSourceNode {
    return this.gateOutputs[key].output();
  }

  private createOutputNodes() {
    this.gateOutputs = {
      and: new GateOutputNode(this.context),
      [StepId.ONE]: new GateOutputNode(this.context),
      [StepId.TWO]: new GateOutputNode(this.context),
      [StepId.THREE]: new GateOutputNode(this.context),
      xor: new GateOutputNode(this.context),
    };
  }

  private setNextStep() {
    Object.values(this.gates).forEach((gate) => {
      if (gate.currentStepProgress >= gate.stepLength) {
        gate.currentStepProgress = 0;
      }
      gate.currentStepProgress += 1;

      if (gate.currentStepProgress !== 1) {
        return;
      }

      if (
        gate.currentStep === this.length - 1
        || gate.currentStep === 15
      ) {
        gate.currentStep = 0;
      } else {
        gate.currentStep += 1;
      }
    });

    this.stepChangeCallback({
      [StepId.ONE]: this.gates[StepId.ONE].currentStep,
      [StepId.TWO]: this.gates[StepId.TWO].currentStep,
      [StepId.THREE]: this.gates[StepId.THREE].currentStep,
    });
  }

  private trigger = (value: number) => {
    if (!this.running) {
      return;
    }

    if (value === 0) {
      this.gateOutputs[StepId.ONE].setLevel(0);
      this.gateOutputs[StepId.TWO].setLevel(0);
      this.gateOutputs[StepId.THREE].setLevel(0);
      this.gateOutputs.xor.setLevel(0);
      this.gateOutputs.and.setLevel(0);
      return;
    }

    if (value === 1) {
      this.setNextStep();
      if (
        this.gates[StepId.ONE].currentStepProgress === 1
        && this.gates[StepId.ONE].values[this.gates[StepId.ONE].currentStep]
      ) {
        this.gateOutputs[StepId.ONE].setLevel(1);
      }
      if (
        this.gates[StepId.TWO].currentStepProgress === 1
        && this.gates[StepId.TWO].values[this.gates[StepId.TWO].currentStep]
      ) {
        this.gateOutputs[StepId.TWO].setLevel(1);
      }
      if (
        this.gates[StepId.THREE].currentStepProgress === 1
        && this.gates[StepId.THREE].values[this.gates[StepId.THREE].currentStep]
      ) {
        this.gateOutputs[StepId.THREE].setLevel(1);
      }
    }
  }
}
