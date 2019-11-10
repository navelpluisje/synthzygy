import { GateInputNode } from '@nodes/gateInputNode';
import { GateOutputNode } from '@nodes/gateOutputNode';

interface GateOutput {
  node: GateOutputNode;
  steps: number;
  step: number;
}

export class ClockNode {
  private pulseWidth: number;
  private bpm: number;
  private frequency: number;
  private context: AudioContext;
  private clock: AudioWorkletNode;
  private gateInput: GateInputNode;
  private gateOutputs: Record<string, GateOutput> = {};

  constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createNodes();
  }

  public setPulseWidth = (pulseWidth: number): void => {
    this.pulseWidth = pulseWidth;
    this.clock.parameters.get('pulseWidth').setTargetAtTime(pulseWidth, this.context.currentTime, 0.001);
  }

  public setBPM = (bpm: number): void => {
    this.bpm = bpm;
    this.frequency = this.bpm / 60;

    const value = this.frequency * (2 ** 3);
    this.clock.parameters.get('frequency').setTargetAtTime(value, this.context.currentTime, 0.001);
  }

  public getPulseWidth(): number {
    return this.pulseWidth;
  }

  public output(id: string): ConstantSourceNode {
    return this.gateOutputs[id].node.output();
  }

  private createGateOuput(steps: number): GateOutput {
    return {
      node: new GateOutputNode(this.context),
      step: 0,
      steps,
    };
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      Object.values(this.gateOutputs).forEach((output) => {
        output.step += 1;
        if (output.step === output.steps) {
          output.node.setLevel(1);
          output.step = 0;
        }
      });
    } else {
      Object.values(this.gateOutputs).forEach((output) => {
        output.node.setLevel(0);
      });
    }
  }

  private createNodes(): void {
    this.clock = new AudioWorkletNode(this.context, 'clock-processor');
    this.gateInput = new GateInputNode(this.context, this.trigger);
    this.gateOutputs['2'] = this.createGateOuput(16);
    this.gateOutputs['/1'] = this.createGateOuput(8);
    this.gateOutputs['/2'] = this.createGateOuput(4);
    this.gateOutputs['/4'] = this.createGateOuput(2);
    this.gateOutputs['/8'] = this.createGateOuput(1);

    this.clock.connect(this.gateInput.input());
  }
}
