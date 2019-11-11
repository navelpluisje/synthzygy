import { NoiseTypes } from '@constants/enums';
import { GateInputNode } from '@nodes/gateInputNode';
import { NoiseNode } from '@nodes/noiseNode';
import { createConstantSourceNode } from '@utilities/createConstantSource';
import { createGainNode } from '@utilities/createGain';
import { createOscillatorNode } from '@utilities/createOscillator';

export class SnareNode {
  private volume: number = .5;
  private decay: number = .3;
  private sweep: number = .5;
  private head: number;
  private snare: number;
  private context: AudioContext;
  private gateInput: GateInputNode;
  private oscillator1Node: OscillatorNode;
  private oscillator2Node: OscillatorNode;
  private oscillator1Gain: GainNode;
  private oscillator2Gain: GainNode;
  private frequencyConstant: ConstantSourceNode;
  private noiseNode: NoiseNode;
  private filter: BiquadFilterNode;
  private noise: GainNode;
  private snareGain: GainNode;
  private outputNode: GainNode;

  public constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.gateInput = new GateInputNode(this.context, this.trigger);
    this.createSnareNode();
  }

  public setVolume = (volume: number): void => {
    this.volume = volume;
    this.outputNode.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.001);
  }

  public setHead = (head: number) => {
    this.head = head;
    this.oscillator1Gain.gain.setTargetAtTime(head + (head * .25), this.context.currentTime, 0.001);
    this.oscillator2Gain.gain.setTargetAtTime(head, this.context.currentTime, 0.001);
  }

  public getHead(): number {
    return this.head;
  }

  public setSnare = (snare: number) => {
    this.snare = snare;
    this.filter.frequency.setTargetAtTime(snare, this.context.currentTime, 0.001);
  }

  public getSnare(): number {
    return this.snare;
  }

  public setDecay = (decay: number): void => {
    this.decay = decay;
  }

  public getDecay(): number {
    return this.decay;
  }

  public inputGate(): GainNode {
    return this.gateInput.input();
  }

  public output(): GainNode {
    return this.outputNode;
  }

  private async createSnareNode(): Promise<void> {
    this.oscillator1Node = createOscillatorNode(this.context, 'sine');
    this.oscillator2Node = createOscillatorNode(this.context, 'sine');
    this.oscillator2Node.detune.setValueAtTime(1100, this.context.currentTime);

    this.frequencyConstant = createConstantSourceNode(this.context, 0);
    this.frequencyConstant.connect(this.oscillator1Node.frequency);
    this.frequencyConstant.connect(this.oscillator2Node.frequency);

    this.oscillator1Gain = createGainNode(this.context, .25);
    this.oscillator2Gain = createGainNode(this.context, 2);
    this.snareGain = createGainNode(this.context, 0);
    this.outputNode = createGainNode(this.context, 1);
    this.setVolume(this.volume);

    this.filter = new BiquadFilterNode(this.context, {
      frequency: 6000,
      gain: .4,
      type: 'highpass',
    });

    this.noiseNode = new NoiseNode(this.context, NoiseTypes.Blue);
    await this.noiseNode.setup();
    this.noise = this.noiseNode.outputNoise();

    this.oscillator1Node
      .connect(this.oscillator1Gain)
      .connect(this.snareGain);
    this.oscillator2Node
      .connect(this.oscillator2Gain)
      .connect(this.snareGain);
    this.noise
      .connect(this.filter)
      .connect(this.snareGain);
    this.snareGain.connect(this.outputNode);
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.snareGain.gain.cancelAndHoldAtTime(0);

      this.frequencyConstant.offset.linearRampToValueAtTime(185, this.context.currentTime);
      this.frequencyConstant.offset.linearRampToValueAtTime(207.65, this.context.currentTime + 0.01);
      this.frequencyConstant.offset.linearRampToValueAtTime(185, this.context.currentTime + this.decay);

      this.snareGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.005);
      this.snareGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
      this.snareGain.gain.linearRampToValueAtTime(1 - this.sweep, this.context.currentTime + 0.065);
      this.snareGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.decay);
    }
  }
}
