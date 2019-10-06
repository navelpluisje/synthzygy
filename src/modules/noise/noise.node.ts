import { NoiseTypes } from '@constants/enums'
import { NoiseNode } from '@nodes/noiseNode'

export class NoisesNode {
  context: AudioContext

  pink: NoiseNode
  white: NoiseNode
  blue: NoiseNode

  constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.pink = new NoiseNode(this.context, NoiseTypes.Pink)
    this.white = new NoiseNode(this.context, NoiseTypes.White)
    this.blue = new NoiseNode(this.context, NoiseTypes.Blue)
  }

  public async setup(): Promise<boolean> {
    await this.pink.setup()
    await this.white.setup()
    await this.blue.setup()
    return true
  }

  public setPinkNoisGain = (gain: number): void => {
    this.pink.setNoiseGain(gain)
  }

  public setWhiteNoisGain = (gain: number): void => {
    this.pink.setNoiseGain(gain)
  }

  public setBlueNoisGain = (gain: number): void => {
    this.pink.setNoiseGain(gain)
  }

  public outputPinkNoise(): GainNode {
    return this.pink.outputNoise()
  }

  public outputWhiteNoise(): GainNode {
    return this.pink.outputNoise()
  }

  public outputBlueNoise(): GainNode {
    return this.pink.outputNoise()
  }
}
