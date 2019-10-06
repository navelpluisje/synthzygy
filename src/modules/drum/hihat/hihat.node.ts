import { NoiseNode } from '@nodes/noiseNode'
import { NoiseTypes } from '@constants/enums'
import { createGainNode } from '@utilities/createGain'

export class HiHatNode {
  private volume: number = .5
  private decay: number = .1
  private context: AudioContext
  private hihatGain: GainNode
  private outputNode: GainNode
  private noiseNode: NoiseNode
  private noise: GainNode
  private filter: BiquadFilterNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createHiHatNode()
  }

  private async createHiHatNode(): Promise<void> {
    this.filter = new BiquadFilterNode(this.context)
    this.filter.type = 'highpass'
    this.setFrequency(4000)

    this.hihatGain = createGainNode(this.context, 0)
    this.outputNode = createGainNode(this.context, this.volume)

    this.noiseNode = new NoiseNode(this.context, NoiseTypes.White)
    await this.noiseNode.setup()
    this.noise = this.noiseNode.outputNoise()

    this.noise.connect(this.filter)
    this.filter.connect(this.hihatGain)
    this.hihatGain.connect(this.outputNode)
  }

  public setVolume = (volume: number): void => {
    this.volume = volume
    this.outputNode.gain.setValueAtTime(this.volume, this.context.currentTime)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  public setFrequency = (frequency: number): void => {
    this.filter.frequency.setValueAtTime(frequency, this.context.currentTime)
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.filter.Q.cancelAndHoldAtTime(0)
      this.filter.Q.linearRampToValueAtTime(10, this.context.currentTime + 0.005)
      this.filter.Q.linearRampToValueAtTime(0, this.context.currentTime + 0.015 + this.decay)

      this.hihatGain.gain.cancelAndHoldAtTime(0)
      this.hihatGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.005)
      this.hihatGain.gain.linearRampToValueAtTime(.5, this.context.currentTime + 0.015)
      this.hihatGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.015 + this.decay)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.outputNode
  }
}
