import { createConstantSourceNode } from '@utilities/createConstantSource';
import { createGainNode } from '@utilities/createGain';
import { createOscillatorNode } from '@utilities/createOscillator';
import { GateTrigger } from 'src/types';

export class KickNode {
  private decay: number = .3;
  private frequency: number = 20;
  private boost: number;
  private sweep: number;
  private context: AudioContext;
  private triangle: OscillatorNode;
  private triangleBoost: GainNode;
  private sine: OscillatorNode;
  private sineBoost: GainNode;
  private square: OscillatorNode;
  private squareBoost: GainNode;
  private frequencyConstant: ConstantSourceNode;
  private kickGain: GainNode;
  private kickBoost: GainNode;

  public constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.sweep = .5;
    this.createKickNode();
  }

  public setDecay = (decay: number): void => {
    this.decay = decay;
  }

  public getDecay(): number {
    return this.decay;
  }

  public setFequency = (frequency: number) => {
    this.frequency = frequency;
  }

  public getFrequency(): number {
    return this.frequency;
  }

  public setSweep = (sweep: number) => {
    this.sweep = sweep;
  }

  public getSweep(): number {
    return this.sweep;
  }

  public setBoost = (boost: number) => {
    this.boost = boost;
    this.sineBoost.gain.setTargetAtTime(boost, this.context.currentTime, 0.001);
    this.squareBoost.gain.setTargetAtTime(boost / 2, this.context.currentTime, 0.001);
  }

  public getBoost(): number {
    return this.boost;
  }

  public inputGate(): GateTrigger {
    return this.trigger;
  }

  public output(): GainNode {
    return this.kickBoost;
  }

  private async createKickNode() {
    this.frequencyConstant = createConstantSourceNode(this.context, 0);
    this.kickGain = createGainNode(this.context, 0);
    this.kickBoost = createGainNode(this.context, 4);

    this.triangle = createOscillatorNode(this.context, 'triangle');
    this.frequencyConstant.connect(this.triangle.frequency);
    this.triangleBoost = createGainNode(this.context, 3);
    this.triangle
      .connect(this.triangleBoost)
      .connect(this.kickGain);

    this.sine = createOscillatorNode(this.context, 'sine');
    this.frequencyConstant.connect(this.sine.frequency);
    this.sineBoost = createGainNode(this.context, 0);
    this.sine
      .connect(this.sineBoost)
      .connect(this.kickGain);

    this.square = createOscillatorNode(this.context, 'square');
    this.frequencyConstant.connect(this.square.frequency);
    this.squareBoost = createGainNode(this.context, 0);
    this.square
      .connect(this.squareBoost)
      .connect(this.kickGain);

    this.kickGain.connect(this.kickBoost);
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.kickGain.gain.cancelAndHoldAtTime(0);

      this.frequencyConstant.offset.linearRampToValueAtTime(20, this.context.currentTime);
      this.frequencyConstant.offset.linearRampToValueAtTime(this.frequency, this.context.currentTime + 0.01);
      this.frequencyConstant.offset.linearRampToValueAtTime(15, this.context.currentTime + this.decay);

      this.kickGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.005);
      this.kickGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
      this.kickGain.gain.linearRampToValueAtTime(1 - this.sweep, this.context.currentTime + 0.065);
      this.kickGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.decay);
    }
  }
}
