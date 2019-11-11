import { NoiseTypes } from '@constants/enums';
import { GateInputNode } from '@nodes/gateInputNode';
import { NoiseNode } from '@nodes/noiseNode';
import { createGainNode } from '@utilities/createGain';

export class HiHatNode {
  private volume: number = .5;
  private decay: number = .1;
  private frequency: number = .1;
  private context: AudioContext;
  private hihatGain: GainNode;
  private gateInput: GateInputNode;
  private outputNode: GainNode;
  private noiseNode: NoiseNode;
  private noise: GainNode;
  private filter: BiquadFilterNode;

  public constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.gateInput = new GateInputNode(this.context, this.trigger);
    this.createHiHatNode();
  }

  public setVolume = (volume: number): void => {
    this.volume = volume;
    this.outputNode.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.001);
  }

  public setDecay = (decay: number): void => {
    this.decay = decay;
  }

  public getDecay(): number {
    return this.decay;
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = frequency;
    this.filter.frequency.setTargetAtTime(frequency, this.context.currentTime, 0.001);
  }

  public getFrequency(): number {
    return this.frequency;
  }

  public inputGate(): GainNode {
    return this.gateInput.input();
  }

  public output(): GainNode {
    return this.outputNode;
  }

  private async createHiHatNode(): Promise<void> {
    this.filter = new BiquadFilterNode(this.context, {
      frequency: 4000,
      type: 'highpass',
    });

    this.hihatGain = createGainNode(this.context, 0);
    this.outputNode = createGainNode(this.context, this.volume);

    this.noiseNode = new NoiseNode(this.context, NoiseTypes.White);
    await this.noiseNode.setup();
    this.noise = this.noiseNode.outputNoise();

    this.noise
      .connect(this.filter)
      .connect(this.hihatGain)
      .connect(this.outputNode);
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.filter.Q.cancelAndHoldAtTime(0);
      this.filter.Q.linearRampToValueAtTime(10, this.context.currentTime + 0.005);
      this.filter.Q.linearRampToValueAtTime(0, this.context.currentTime + 0.015 + this.decay);

      this.hihatGain.gain.cancelAndHoldAtTime(0);
      this.hihatGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.005);
      this.hihatGain.gain.linearRampToValueAtTime(.5, this.context.currentTime + 0.015);
      this.hihatGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.015 + this.decay);
    }
  }
}
