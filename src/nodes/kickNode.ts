import { NoiseNode } from "./noiseNode"

export class KickNode {
  private volume: number = .5
  private decay: number = .5
  private delayTime: number = .5
  private dryWet: number = .5
  private context: AudioContext
  private filterNode: BiquadFilterNode
  private noiseNode: NoiseNode
  private whiteNoise: GainNode
  private kickGain: GainNode
  private kickBoost: GainNode
  private outputNode: GainNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createSnareNode()
  }

  private async createSnareNode() {
    this.filterNode = this.context.createBiquadFilter()
    this.filterNode.frequency.setValueAtTime(40, this.context.currentTime)
    this.filterNode.Q.setValueAtTime(225, this.context.currentTime)

    this.kickGain = this.context.createGain()
    this.kickGain.gain.setValueAtTime(0, this.context.currentTime)

    this.kickBoost = this.context.createGain()
    this.kickBoost.gain.setValueAtTime(4, this.context.currentTime)

    this.outputNode = this.context.createGain()
    this.setVolume(this.volume)

    this.noiseNode = new NoiseNode(this.context)
    await this.noiseNode.setup()
    this.whiteNoise = this.noiseNode.outputBlueNoise()

    this.whiteNoise.connect(this.filterNode)
    this.filterNode.connect(this.kickGain)
    this.kickGain.connect(this.kickBoost)
    this.kickBoost.connect(this.outputNode)
  }

  public setVolume = (volume: number): void => {
    this.volume = volume
    this.outputNode.gain.setValueAtTime(this.volume, this.context.currentTime)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  setFequency = (value: number) => {
    this.filterNode.frequency.setValueAtTime(value, this.context.currentTime)
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.kickGain.gain.cancelAndHoldAtTime(0)
      this.kickGain.gain.setValueCurveAtTime([0, 4], this.context.currentTime, 0.0005)
      this.kickGain.gain.setValueCurveAtTime([4, 0], this.context.currentTime + 0.0005, 0.2)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.outputNode
  }
}
