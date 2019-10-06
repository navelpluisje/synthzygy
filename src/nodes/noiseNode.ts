import { NoiseTypes } from '@constants/enums';

export class NoiseNode {
  context: AudioContext
  noiseType: NoiseTypes
  noiseBuffer: AudioBuffer
  noiseNode: AudioBufferSourceNode
  noise: GainNode

  constructor(
    context: AudioContext,
    type: NoiseTypes
  ) {
    this.context = context
    this.noiseType = type
  }

  public async setup(): Promise<boolean> {
    await this.createNoiseNode()
    await this.createGainNode()
    await this.connectNodes()
    return true
  }

  private async getNoise(type: NoiseTypes): Promise<AudioBuffer> {
    let soundSource: AudioBuffer
    let noiseData: ArrayBuffer
    const response = await fetch(`/assets/audio/${type}noise.mp3`)
    try {
      noiseData = await response.arrayBuffer()
    } catch (e) {
      console.error('could not get data for convolver', e)
    }
    await this.context.decodeAudioData(noiseData, (buffer) => {
      soundSource = buffer
    })

    return soundSource
  }

  private async createNoiseNode(): Promise<boolean> {
    this.noiseBuffer = await this.getNoise(this.noiseType)

    this.noiseNode = this.context.createBufferSource()
    this.noiseNode.buffer = this.noiseBuffer
    this.noiseNode.loop = true
    this.noiseNode.start(0)

    return true
  }

  private async createGainNode() {
    this.noise = this.context.createGain()
    this.noise.gain.setValueAtTime(2.5, this.context.currentTime)
  }

  private async connectNodes() {
    this.noiseNode.connect(this.noise)
  }

  public setNoiseGain = (gain: number): void => {
    this.noise.gain.setValueAtTime(gain, this.context.currentTime)
  }

  public outputNoise(): GainNode {
    return this.noise
  }
}
