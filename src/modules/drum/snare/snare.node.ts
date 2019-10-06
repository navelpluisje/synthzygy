import { NoiseNode } from "@nodes/noiseNode"
import { NoiseTypes } from "@constants/enums"
import { createOscillatorNode } from '@utilities/createOscillator'
import { createGainNode } from '@utilities/createGain'
import { createConstantSourceNode } from "@utilities/createConstantSource"

export class SnareNode {
  private volume: number = .5
  private decay: number = .3
  private sweep: number = .5
  private context: AudioContext
  private oscillator1Node: OscillatorNode
  private oscillator2Node: OscillatorNode
  private oscillator1Gain: GainNode
  private oscillator2Gain: GainNode
  private frequencyConstant: ConstantSourceNode
  private noiseNode: NoiseNode
  private filter: BiquadFilterNode
  private noise: GainNode
  private snareGain: GainNode
  private outputNode: GainNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createSnareNode()
  }

  private async createSnareNode(): Promise<void> {
    this.oscillator1Node = createOscillatorNode(this.context, 'sine')
    this.oscillator2Node = createOscillatorNode(this.context, 'sine')
    this.oscillator2Node.detune.setValueAtTime(1100, this.context.currentTime)

    this.frequencyConstant = createConstantSourceNode(this.context, 0)
    this.frequencyConstant.connect(this.oscillator1Node.frequency)
    this.frequencyConstant.connect(this.oscillator2Node.frequency)

    this.oscillator1Gain = createGainNode(this.context, .25)
    this.oscillator2Gain = createGainNode(this.context, 2)
    this.snareGain = createGainNode(this.context, 0)
    this.outputNode = createGainNode(this.context, 1)
    this.setVolume(this.volume)

    this.filter = this.context.createBiquadFilter()
    this.filter.type = 'highpass'
    this.filter.gain.setValueAtTime(.4, this.context.currentTime)
    this.filter.frequency.setValueAtTime(6000, this.context.currentTime)

    this.noiseNode = new NoiseNode(this.context, NoiseTypes.Blue)
    await this.noiseNode.setup()
    this.noise = this.noiseNode.outputNoise()

    this.oscillator1Node.connect(this.oscillator1Gain)
    this.oscillator2Node.connect(this.oscillator2Gain)
    this.oscillator1Gain.connect(this.snareGain)
    this.oscillator2Gain.connect(this.snareGain)
    this.noise.connect(this.filter).connect(this.snareGain)
    this.snareGain.connect(this.outputNode)
  }

  public setVolume = (volume: number): void => {
    this.volume = volume
    this.outputNode.gain.setValueAtTime(this.volume, this.context.currentTime)
  }

  public setHead = (value: number) => {
    this.oscillator1Gain.gain.setValueAtTime(value + (value * .25), this.context.currentTime)
    this.oscillator2Gain.gain.setValueAtTime(value, this.context.currentTime)
  }

  public setSnare = (value: number) => {
    this.filter.frequency.setValueAtTime(value, this.context.currentTime)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.snareGain.gain.cancelAndHoldAtTime(0)

      this.frequencyConstant.offset.linearRampToValueAtTime(185, this.context.currentTime)
      this.frequencyConstant.offset.linearRampToValueAtTime(207.65, this.context.currentTime + 0.01)
      this.frequencyConstant.offset.linearRampToValueAtTime(185, this.context.currentTime + this.decay)

      this.snareGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.005)
      this.snareGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01)
      this.snareGain.gain.linearRampToValueAtTime(1 - this.sweep, this.context.currentTime + 0.065)
      this.snareGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.decay)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.outputNode
  }
}
