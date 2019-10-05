import { NoiseNode } from "./noiseNode"

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
    this.frequencyConstant = this.context.createConstantSource()
    this.frequencyConstant.offset.setValueAtTime(0, this.context.currentTime)
    this.frequencyConstant.start()

    this.oscillator1Node = this.createOscillatorNode('sine')
    this.oscillator2Node = this.createOscillatorNode('sine')
    this.oscillator2Node.detune.setValueAtTime(1100, this.context.currentTime)

    this.oscillator1Gain = this.context.createGain()
    this.oscillator1Gain.gain.setValueAtTime(.25, this.context.currentTime)

    this.oscillator2Gain = this.context.createGain()
    this.oscillator2Gain.gain.setValueAtTime(2, this.context.currentTime)

    this.snareGain = this.context.createGain()
    this.snareGain.gain.setValueAtTime(0, this.context.currentTime)

    this.outputNode = this.context.createGain()
    this.setVolume(this.volume)

    this.filter = this.context.createBiquadFilter()
    this.filter.type = 'highpass'
    this.filter.gain.setValueAtTime(.4, this.context.currentTime)
    this.filter.frequency.setValueAtTime(6000, this.context.currentTime)

    this.noiseNode = new NoiseNode(this.context)
    await this.noiseNode.setup()
    this.whiteNoise = this.noiseNode.outputBlueNoise()

    this.oscillator1Node.connect(this.oscillator1Gain)
    this.oscillator2Node.connect(this.oscillator2Gain)
    this.oscillator1Gain.connect(this.snareGain)
    this.oscillator2Gain.connect(this.snareGain)
    this.whiteNoise.connect(this.filter).connect(this.snareGain)
    this.snareGain.connect(this.outputNode)
  }

  private createOscillatorNode(type: OscillatorType): OscillatorNode {
    const osc = this.context.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(0, this.context.currentTime)
    osc.start()

    this.frequencyConstant.connect(osc.frequency)

    return osc
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
