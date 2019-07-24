export interface VcaNode {
  // Controls
  setGain(gain: number): void
  // Inputs
  connectGate(): AudioParam | GainNode
  connectAudioIn(): AudioParam | GainNode  // Outputs
}

export class VcaNode implements VcaNode {
  gain: number
  context: AudioContext
  gainNode: GainNode

  constructor(
    context: AudioContext,
    gain: number = 0.5,
  ) {
    this.context = context
    this.gain = gain
    this.createGainNode()
  }

  createGainNode() {
    this.gainNode = this.context.createGain()
    this.gainNode.gain.setValueAtTime(this.gain, this.context.currentTime)
  }

  setGain = (gain: number): void => {
    this.gain = gain
    this.gainNode.gain.setValueAtTime(this.gain, this.context.currentTime)
  }

  connectAudioIn(): GainNode {
    return this.gainNode
  }

  connectGate(): AudioParam {
    return this.gainNode.gain
  }

  output(): GainNode {
    return this.gainNode
  }
}