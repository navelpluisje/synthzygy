import { NoiseTypes } from '@constants/enums';

export type NoiseBuffersType = {
  [key in NoiseTypes]: AudioBuffer
};
export type NoiseBufferNodesType = {
  [key in NoiseTypes]: AudioBufferSourceNode
};

export class NoiseNode {
  context: AudioContext
  noiseType: NoiseTypes
  noiseBuffers: NoiseBuffersType

  pinkNoiseNode: AudioBufferSourceNode
  pinkNoise: GainNode
  whiteNoiseNode: AudioBufferSourceNode
  whiteNoise: GainNode
  blueNoiseNode: AudioBufferSourceNode
  blueNoise: GainNode

  constructor(
    context: AudioContext,
  ) {
    this.context = context
  }

  public async setup() {
    await this.createNoiseNodes()
    await this.createGainNodes()
    await this.connectNodes()
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

  private async createNoiseNodes(): Promise<boolean> {
    this.noiseBuffers = {
      pink: await this.getNoise(NoiseTypes.Pink),
      white: await this.getNoise(NoiseTypes.White),
      blue: await this.getNoise(NoiseTypes.Blue),
    }
    this.pinkNoiseNode = this.context.createBufferSource()
    this.pinkNoiseNode.buffer = this.noiseBuffers.pink
    this.pinkNoiseNode.loop = true
    this.pinkNoiseNode.start(0)

    this.whiteNoiseNode = this.context.createBufferSource()
    this.whiteNoiseNode.buffer = this.noiseBuffers.white
    this.whiteNoiseNode.loop = true
    this.whiteNoiseNode.start(0)

    this.blueNoiseNode = this.context.createBufferSource()
    this.blueNoiseNode.buffer = this.noiseBuffers.blue
    this.blueNoiseNode.loop = true
    this.blueNoiseNode.start(0)

    return true
  }

  private async createGainNodes() {
    this.pinkNoise = this.context.createGain()
    this.pinkNoise.gain.setValueAtTime(2.5, this.context.currentTime)

    this.whiteNoise = this.context.createGain()
    this.whiteNoise.gain.setValueAtTime(2.5, this.context.currentTime)

    this.blueNoise = this.context.createGain()
    this.blueNoise.gain.setValueAtTime(2.5, this.context.currentTime)
  }

  private async connectNodes() {
    this.whiteNoiseNode.connect(this.whiteNoise)
    this.pinkNoiseNode.connect(this.pinkNoise)
    this.blueNoiseNode.connect(this.blueNoise)
  }

  public setPinkNoisGain = (gain: number): void => {
    this.pinkNoise.gain.setValueAtTime(gain, this.context.currentTime)
  }

  public setWhiteNoisGain = (gain: number): void => {
    this.whiteNoise.gain.setValueAtTime(gain, this.context.currentTime)
  }

  public setBlueNoisGain = (gain: number): void => {
    this.blueNoise.gain.setValueAtTime(gain, this.context.currentTime)
  }

  public outputPinkNoise(): GainNode {
    return this.pinkNoise
  }

  public outputWhiteNoise(): GainNode {
    return this.whiteNoise
  }

  public outputBlueNoise(): GainNode {
    return this.blueNoise
  }
}
