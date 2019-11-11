import { Transport } from '@constants/enums';
import { GateInputNode } from '@nodes/gateInputNode';
import { GateOutputNode } from '@nodes/gateOutputNode';
import { createConstantSourceNode } from '@utilities/createConstantSource';
import { GateTrigger, ModuleDefaultValues } from 'src/types';

export class SequencerNode {
  private stepsA: Float32Array;
  private stepsB: Float32Array;
  private gates: boolean[];
  private length: number = 16;
  private running: boolean = false;
  private currentStep: number = -1;
  private context: AudioContext;
  private cvOutputNodeA: ConstantSourceNode;
  private cvOutputNodeB: ConstantSourceNode;
  private gateOutput: GateOutputNode;
  private gateInput: GateInputNode;
  private transportCallback: GateTrigger;
  private stepChangeCallback: (step: number) => void;

  constructor(
    context: AudioContext,
    stepChangeCallback: (step: number) => void,
    initialData: ModuleDefaultValues,
    ) {
    this.context = context;
    this.setStepsA(initialData.stepsA as number[]);
    this.setStepsB(initialData.stepsB as number[]);
    this.setGates(initialData.gates as boolean[]);
    this.gateInput = new GateInputNode(this.context, this.trigger);
    this.gateOutput = new GateOutputNode(this.context);
    this.createCvOutputNodes();
    this.stepChangeCallback = stepChangeCallback;
  }

  public setLength(length: number): void {
    this.length = length;
  }

  public setStepsA(value: number[]) {
    this.stepsA = new Float32Array(value);
  }

  public getStepsA(): number[] {
    return Object.values(this.stepsA);
  }

  public setStepsB(value: number[]) {
    this.stepsB = new Float32Array(value);
  }

  public getStepsB(): number[] {
    return Object.values(this.stepsB);
  }

  public getStepDataByGroupId(group: 'A' | 'B') {
    if (group === 'B') {
      return this.getStepsB();
    }
    return this.getStepsA();
  }

  public setGates(value: boolean[]) {
    this.gates = value;
  }

  public getGates(): boolean[] {
    return this.gates;
  }

  public start(): void {
    this.running = true;
  }

  public stop(): void {
    this.running = false;
  }

  public reset(): void {
    this.currentStep = -1;
  }

  public setStepValue(index: number, group: 'A' | 'B', value: number) {
    switch (group) {
      case 'A':
        this.stepsA[index] = value;
        break;
      case 'B':
        this.stepsB[index] = value;
        break;
      default:
        this.stepsA[index] = value;
    }
  }

  public setGateStep(index: number, value: boolean) {
    this.gates[index] = value;
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

  public getStepValues(group: 'A' | 'B'): Float32Array {
    switch (group) {
      case 'A':
        return this.stepsA;
      case 'B':
        return this.stepsB;
      default:
        return this.stepsA;
    }
  }

  public cvStartStop(transportCallback: GateTrigger): GateTrigger {
    this.transportCallback = transportCallback;
    return this.triggerTransport;
  }

  public inputGate(): GainNode {
    return this.gateInput.input();
  }

  public outputA(): ConstantSourceNode {
    return this.cvOutputNodeA;
  }

  public outputB(): ConstantSourceNode {
    return this.cvOutputNodeB;
  }

  public outputGate(): ConstantSourceNode {
    return this.gateOutput.output();
  }

  private createCvOutputNodes() {
    this.cvOutputNodeA = createConstantSourceNode(this.context, 0);
    this.cvOutputNodeB = createConstantSourceNode(this.context, 0);
  }

  private setNextStep() {
    if (this.currentStep === this.length - 1) {
      this.currentStep = 0;
    } else {
      this.currentStep += 1;
    }
    this.stepChangeCallback(this.currentStep);
  }

  private trigger = (value: number) => {
    if (!this.running) {
      return;
    }

    if (value === 1) {
      this.setNextStep();
      this.cvOutputNodeA.offset.setTargetAtTime(
        this.stepsA[this.currentStep],
        this.context.currentTime,
        0.001,
      );
      this.cvOutputNodeB.offset.setTargetAtTime(
        this.stepsB[this.currentStep],
        this.context.currentTime,
        0.001,
      );
    }
    if (this.gates[this.currentStep]) {
      this.gateOutput.setLevel(value);
    }
  }
}
