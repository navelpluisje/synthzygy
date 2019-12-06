import { createGainNode } from '@utilities/createGain';

export class ClockNode {
  private pulseWidth: number;
  private bpm: number;
  private frequency: number;
  private context: AudioContext;
  private clock: AudioWorkletNode;
  // private gateInput: GateInputNode;
  private gateOutputs: Record<string, GainNode> = {};

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

  public output(id: string): GainNode {
    return this.gateOutputs[id];
  }

  private createNodes(): void {
    this.clock = new AudioWorkletNode(this.context, 'clock-processor', {
      numberOfOutputs: 5,
    });
    // this.gateInput = new GateInputNode(this.context, this.trigger);
    this.gateOutputs['2'] = createGainNode(this.context, 1);
    this.gateOutputs['/1'] = createGainNode(this.context, 1);
    this.gateOutputs['/2'] = createGainNode(this.context, 1);
    this.gateOutputs['/4'] = createGainNode(this.context, 1);
    this.gateOutputs['/8'] = createGainNode(this.context, 1);

    this.clock.connect(this.gateOutputs['2'], 0);
    this.clock.connect(this.gateOutputs['/1'], 1);
    this.clock.connect(this.gateOutputs['/2'], 2);
    this.clock.connect(this.gateOutputs['/4'], 3);
    this.clock.connect(this.gateOutputs['/8'], 4);
  }
}
