import { outputTypes } from '@modules/oscillator/outputs';
import { createGainNode } from '@utilities/createGain';

export interface VcaNode {
  // Controls
  setGain(gain: number): void;
  // Inputs
  input(): GainNode;
  inputCvGain(): GainNode;
  outputTypes(): GainNode;
}

export class VcaNode implements VcaNode {
  public gain: number;
  public context: AudioContext;
  public gainNode: GainNode;
  public cvGainNode: AudioWorkletNode;
  public cvNode: GainNode;

  constructor(
    context: AudioContext,
    gain: number = 0,
  ) {
    this.context = context;
    this.gain = gain;
    this.createGainNode();
  }

  public createGainNode() {
    this.gainNode = createGainNode(this.context, this.gain);
    this.cvNode = createGainNode(this.context, 0);
    this.cvNode.connect(this.gainNode.gain);
  }

  public setGain = (gain: number): void => {
    this.gain = gain;
    this.cvNode.gain.setValueAtTime(this.gain, this.context.currentTime);
  }

  public input(): GainNode {
    return this.gainNode;
  }

  public inputCvGain(): GainNode {
    return this.cvNode;
  }

  public output(): GainNode {
    return this.gainNode;
  }
}
