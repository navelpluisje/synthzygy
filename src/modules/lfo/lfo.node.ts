import { createConstantSourceNode } from '@utilities/createConstantSource';
import { createGainNode } from '@utilities/createGain';
import { createOscillatorNode } from '@utilities/createOscillator';

export class LfoNode {
  private frequency: number;
  private context: AudioContext;
  private squareWave: OscillatorNode;
  private squareBoost: GainNode;
  private sawWave: OscillatorNode;
  private sawBoost: GainNode;
  private sineWave: OscillatorNode;
  private sineBoost: GainNode;
  private triangleWave: OscillatorNode;
  private triangleBoost: GainNode;
  private frequencyConstant: ConstantSourceNode;

  constructor(
    context: AudioContext,
    frequency: number = 5,
  ) {
    this.context = context;
    this.frequency = frequency;
    this.createOscillators();
    this.createGainNodes();
    this.connectNodes();
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = Math.max(frequency, 0.01);
    this.handleFrequencyChange();
  }

  public outputSaw(): GainNode {
    return this.sawBoost;
  }

  public outputSine(): GainNode {
    return this.sineBoost;
  }

  public outputSquare(): GainNode {
    return this.squareBoost;
  }

  public outputTriangle(): GainNode {
    return this.triangleBoost;
  }

  private createOscillators(): void {
    this.squareWave = createOscillatorNode(this.context, 'square', 0);
    this.sawWave = createOscillatorNode(this.context, 'sawtooth', 0);
    this.sineWave = createOscillatorNode(this.context, 'sine', 0);
    this.triangleWave = createOscillatorNode(this.context, 'triangle', 0);
  }

  private createGainNodes(): void {
    this.squareBoost = createGainNode(this.context, 2.5);
    this.sawBoost = createGainNode(this.context, 2.5);
    this.sineBoost = createGainNode(this.context, 2.5);
    this.triangleBoost = createGainNode(this.context, 2.5);
    this.frequencyConstant = createConstantSourceNode(this.context, 0);
    this.handleFrequencyChange();
  }

  private connectNodes(): void {
    this.frequencyConstant.connect(this.squareWave.frequency);
    this.frequencyConstant.connect(this.sawWave.frequency);
    this.frequencyConstant.connect(this.sineWave.frequency);
    this.frequencyConstant.connect(this.triangleWave.frequency);

    this.squareWave.connect(this.squareBoost);
    this.sawWave.connect(this.sawBoost);
    this.sineWave.connect(this.sineBoost);
    this.triangleWave.connect(this.triangleBoost);
  }

  private handleFrequencyChange(): void {
    this.frequencyConstant.offset.setTargetAtTime(this.frequency, this.context.currentTime, 0.001);
  }
}
