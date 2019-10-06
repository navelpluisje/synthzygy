import { outputTypes } from "@modules/oscillator/outputs";
import { createGainNode } from "@utilities/createGain";

export interface VcaNode {
  // Controls
  setGain(gain: number): void
  // Inputs
  input(): GainNode
  inputCvGain(): GainNode
  outputTypes(): GainNode
}

export class VcaNode implements VcaNode {
  gain: number
  context: AudioContext
  gainNode: GainNode
  cvGainNode: AudioWorkletNode
  cvNode: GainNode

  constructor(
    context: AudioContext,
    gain: number = 0,
  ) {
    this.context = context
    this.gain = gain
    this.createGainNode()
  }

  createGainNode() {
    this.gainNode = createGainNode(this.context, this.gain)
    this.cvNode = createGainNode(this.context, 0)
    this.cvNode.connect(this.gainNode.gain)
  }

  setGain = (gain: number): void => {
    this.gain = gain
    this.cvNode.gain.setValueAtTime(this.gain, this.context.currentTime)
  }

  input(): GainNode {
    return this.gainNode
  }

  inputCvGain(): GainNode {
    return this.cvNode
  }

  output(): GainNode {
    return this.gainNode
  }
}