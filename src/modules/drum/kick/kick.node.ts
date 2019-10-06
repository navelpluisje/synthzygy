import { createOscillatorNode } from '@utilities/createOscillator';
import { createGainNode } from '@utilities/createGain';


export class KickNode {
  private decay: number = .3
  private frequency: number = 20
  private context: AudioContext
  private triangle: OscillatorNode
  private triangleBoost: GainNode
  private sine: OscillatorNode
  private sineBoost: GainNode
  private square: OscillatorNode
  private squareBoost: GainNode
  private frequencyConstant: ConstantSourceNode
  private sweep: number
  private kickGain: GainNode
  private kickBoost: GainNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.sweep = .5
    this.createKickNode()
  }

  private async createKickNode() {
    this.frequencyConstant = this.context.createConstantSource()
    this.frequencyConstant.offset.setValueAtTime(0, this.context.currentTime)
    this.frequencyConstant.start()

    this.triangle = createOscillatorNode(this.context, 'triangle')
    this.frequencyConstant.connect(this.triangle.frequency)
    this.triangleBoost = createGainNode(this.context, 3)
    this.triangle.connect(this.triangleBoost)

    this.sine = createOscillatorNode(this.context, 'sine')
    this.frequencyConstant.connect(this.sine.frequency)
    this.sineBoost = createGainNode(this.context, 0)
    this.sine.connect(this.sineBoost)

    this.square = createOscillatorNode(this.context, 'square')
    this.frequencyConstant.connect(this.square.frequency)
    this.squareBoost = createGainNode(this.context, 0)
    this.square.connect(this.squareBoost)

    this.kickGain = createGainNode(this.context, 0)
    this.kickBoost = createGainNode(this.context, 4)

    this.triangleBoost.connect(this.kickGain)
    this.sineBoost.connect(this.kickGain)
    this.squareBoost.connect(this.kickGain)
    this.kickGain.connect(this.kickBoost)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  public setFequency = (frequency: number) => {
    this.frequency = frequency
  }

  public setSweep = (sweep: number) => {
    this.sweep = sweep
  }

  public setBoost = (boost: number) => {
    this.sineBoost.gain.setValueAtTime(boost, this.context.currentTime)
    this.squareBoost.gain.setValueAtTime(boost / 2, this.context.currentTime)
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.kickGain.gain.cancelAndHoldAtTime(0)

      this.frequencyConstant.offset.linearRampToValueAtTime(20, this.context.currentTime)
      this.frequencyConstant.offset.linearRampToValueAtTime(this.frequency, this.context.currentTime + 0.01)
      this.frequencyConstant.offset.linearRampToValueAtTime(15, this.context.currentTime + this.decay)

      this.kickGain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.005)
      this.kickGain.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01)
      this.kickGain.gain.linearRampToValueAtTime(1 - this.sweep, this.context.currentTime + 0.065)
      this.kickGain.gain.linearRampToValueAtTime(0, this.context.currentTime + this.decay)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.kickBoost
  }
}
