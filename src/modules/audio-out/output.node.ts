import { createGainNode } from "@utilities/createGain"

export class OutputNode {
  private gain: number
  private context: AudioContext
  private gainNode: GainNode

  constructor(
    context: AudioContext,
    gain: number = 0.5,
  ) {
    this.context = context
    this.gain = gain
    this.createGainNode()
  }

  createGainNode() {
    this.gainNode = createGainNode(this.context, this.gain)
    this.gainNode.connect(this.context.destination)
  }

  setGain = (gain: number): void => {
    this.gain = gain
    this.gainNode.gain.setValueAtTime(this.gain, this.context.currentTime)
  }

  connectAudioIn(): GainNode {
    return this.gainNode
  }
}