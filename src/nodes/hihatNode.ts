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
  private hpFilter: BiquadFilterNode
  private lpFilter: BiquadFilterNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createHiHatNode()
  }

  private async createHiHatNode(): Promise<void> {
    this.hpFilter = new BiquadFilterNode(this.context)
    this.hpFilter.type = 'highpass'
    this.setFrequency(4000)

    this.hihatGain = createGainNode(this.context, 0)
    this.outputNode = this.context.createGain()
    this.setVolume(this.volume)

    this.noiseNode = new NoiseNode(this.context, NoiseTypes.White)
    await this.noiseNode.setup()
    this.noise = this.noiseNode.outputNoise()

    this.noise.connect(this.hpFilter)
    // this.hpFilter.connect(this.lpFilter)
    this.hpFilter.connect(this.hihatGain)
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
    this.hpFilter.frequency.setValueAtTime(frequency, this.context.currentTime)
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.hpFilter.Q.cancelAndHoldAtTime(0)
      this.hpFilter.Q.linearRampToValueAtTime(10, this.context.currentTime + 0.005)
      this.hpFilter.Q.linearRampToValueAtTime(0, this.context.currentTime + 0.015 + this.decay)

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
