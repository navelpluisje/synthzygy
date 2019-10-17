import { GateNode } from '@nodes/gateNode';
import { createConstantSourceNode } from '@utilities/createConstantSource';
import { GateTrigger } from 'src/types';

const BIT_2 = 2;
const BIT_3 = 4;
const BIT_4 = 8;
const BIT_6 = 32;
const BIT_8 = 128;
const BIT_12 = 2048;
const BIT_16 = 32768;
const BIT_17 = 65536;

type Lengths = '2' | '3' | '4' | '6' | '8' | '12' | '16';
type Bit = 0 | 1;

export class TuringMachineNode {
  private probability: number;
  private length: Lengths = '16';
  private lengths: Lengths[] = ['2', '3', '4', '6', '8', '12', '16'];
  private context: AudioContext;
  private gateOutput: GateNode;
  private pulsesOutputs: Record<string, GateNode>;
  private cvOutputNode: ConstantSourceNode;
  private binData: number;
  private value: number;
  private overFlow: Record<Lengths, Bit>;

  constructor(
    context: AudioContext,
  ) {
    this.context = context;

    this.binData = parseInt('1011001100111100', 2);
    this.setValue(this.binData);
    this.setInitialOverflow();
    this.createNodes();
    this.createPulsesOutputs();
  }

  public setLength = (length: number): void => {
    this.length = this.lengths[length];
  }

  public setProbability = (probability: number): void => {
    this.probability = probability;
  }

  public outputPulse(pulse: string): GateNode {
    return this.pulsesOutputs[pulse];
  }

  public inputClock(): GateTrigger {
    return this.trigger;
  }

  public outputGate(): GateNode {
    return this.gateOutput;
  }

  public output(): ConstantSourceNode {
    return this.cvOutputNode;
  }

  private createNodes() {
    this.cvOutputNode = createConstantSourceNode(this.context);
    this.setCvOutput(this.value);
    this.gateOutput = new GateNode();
  }

  private setCvOutput(value: number): void {
    const val = value / 255 * 8;
    this.cvOutputNode.offset.setTargetAtTime(val, this.context.currentTime, 0.001);
  }

  private setInitialOverflow(): void {
    this.overFlow = {
      2: this.binData & BIT_2 ? 1 : 0,
      3: this.binData & BIT_3 ? 1 : 0,
      4: this.binData & BIT_4 ? 1 : 0,
      6: this.binData & BIT_6 ? 1 : 0,
      8: this.binData & BIT_8 ? 1 : 0,
      12: this.binData & BIT_12 ? 1 : 0,
      16: this.binData & BIT_16 ? 1 : 0,
    };
  }

  private createPulsesOutputs() {
    this.pulsesOutputs = {
      '2': new GateNode(),
      '2+4': new GateNode(),
      '2+6': new GateNode(),
      '4': new GateNode(),
      '6': new GateNode(),
      '8': new GateNode(),
    };
  }

  private setValue(value: number): void {
    this.value = parseInt(value.toString(16).slice(-2), 16);
  }

  private trigger = (value: number): void => {
    this.setCvOutput(this.value);
    if (value === 1) {
      this.gateOutput.onKeyDown();
      this.triggerPulses();
    } else {
      this.gateOutput.onKeyUp();
      this.unTriggerPulses();
    }

    let bit: Bit = this.overFlow[this.length];
    if (this.probability < 11) {
      bit = (Math.floor(Math.random() * 100) % this.probability === 0
        ? 1 - this.overFlow[this.length]
        : this.overFlow[this.length]) as Bit;
    }
    this.setNextStep(bit);
    this.setValue(this.binData);
  }

  private setNextStep(bit: Bit) {
    this.binData = (this.binData << 1) + bit;
    this.overFlow['2'] = (this.binData & BIT_2) ? 1 : 0;
    this.overFlow['3'] = (this.binData & BIT_3) ? 1 : 0;
    this.overFlow['4'] = (this.binData & BIT_4) ? 1 : 0;
    this.overFlow['6'] = (this.binData & BIT_6) ? 1 : 0;
    this.overFlow['8'] = (this.binData & BIT_8) ? 1 : 0;
    this.overFlow['12'] = (this.binData & BIT_12) ? 1 : 0;
    this.overFlow['16'] = (this.binData & BIT_16) ? 1 : 0;
    this.binData = this.binData - (this.binData & BIT_17);
  }

  private triggerPulses() {
    let two = false;
    if (this.overFlow['2'] === 1) {
      two = true;
      this.pulsesOutputs['2'].trigger(1);
    }
    if (this.overFlow['4'] === 1) {
      this.pulsesOutputs['4'].trigger(1);
      two && this.pulsesOutputs['2+4'].trigger(1);
    }
    if (this.overFlow['6'] === 1) {
      this.pulsesOutputs['6'].trigger(1);
      two && this.pulsesOutputs['2+6'].trigger(1);
    }
    if (this.overFlow['8'] === 1) {
      this.pulsesOutputs['8'].trigger(1);
    }
  }

  private unTriggerPulses() {
    this.pulsesOutputs['2'].trigger(0);
    this.pulsesOutputs['4'].trigger(0);
    this.pulsesOutputs['6'].trigger(0);
    this.pulsesOutputs['8'].trigger(0);
    this.pulsesOutputs['2+4'].trigger(0);
    this.pulsesOutputs['2+6'].trigger(0);
  }
}
