import { NoiseNode } from "./noiseNode"

export class SnareNode {
  private volume: number = .5
  private decay: number = .3
  private context: AudioContext
  private oscillator1Node: OscillatorNode
  private oscillator2Node: OscillatorNode
  private oscillator1Gain: GainNode
  private oscillator2Gain: GainNode
  private noiseNode: NoiseNode
  private whiteNoise: GainNode
  private snareGain: GainNode
  private outputNode: GainNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createSnareNode()
  }

  private async createSnareNode() {
    this.oscillator1Node = this.context.createOscillator()
    this.oscillator1Node.frequency.setValueAtTime(185, this.context.currentTime)
    this.oscillator1Node.start()

    this.oscillator1Gain = this.context.createGain()
    this.oscillator1Gain.gain.setValueAtTime(.25, this.context.currentTime)

    this.oscillator2Node = this.context.createOscillator()
    this.oscillator2Node.frequency.setValueAtTime(349.23, this.context.currentTime)
    this.oscillator2Node.start()

    this.oscillator2Gain = this.context.createGain()
    this.oscillator2Gain.gain.setValueAtTime(.2, this.context.currentTime)


    this.snareGain = this.context.createGain()
    this.snareGain.gain.setValueAtTime(0, this.context.currentTime)

    this.outputNode = this.context.createGain()
    this.setVolume(this.volume)

    this.noiseNode = new NoiseNode(this.context)
    await this.noiseNode.setup()
    this.whiteNoise = this.noiseNode.outputBlueNoise()

    this.oscillator1Node.connect(this.oscillator1Gain)
    this.oscillator2Node.connect(this.oscillator2Gain)
    this.oscillator1Gain.connect(this.snareGain)
    this.oscillator2Gain.connect(this.snareGain)
    this.whiteNoise.connect(this.snareGain)
    this.snareGain.connect(this.outputNode)
  }

  public setVolume = (volume: number): void => {
    this.volume = volume
    this.outputNode.gain.setValueAtTime(this.volume, this.context.currentTime)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.snareGain.gain.cancelAndHoldAtTime(0)
      this.snareGain.gain.setValueCurveAtTime([0, 2], this.context.currentTime, 0.001)
      this.snareGain.gain.setValueCurveAtTime([2, 0], this.context.currentTime + 0.001, this.decay)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.outputNode
  }
}
