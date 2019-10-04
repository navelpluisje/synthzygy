export class KickNode {
  private decay: number = .3
  private frequency: number = 20
  private dryWet: number = .5
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

    this.triangle = this.createOscillatorNode('triangle')
    this.triangleBoost = this.createBoostNode(3)
    this.triangle.connect(this.triangleBoost)

    this.sine = this.createOscillatorNode('sine')
    this.sineBoost = this.createBoostNode(0)
    this.sine.connect(this.sineBoost)

    this.square = this.createOscillatorNode('square')
    this.squareBoost = this.createBoostNode(0)
    this.square.connect(this.squareBoost)

    this.kickGain = this.context.createGain()
    this.kickGain.gain.setValueAtTime(0, this.context.currentTime)

    this.triangleBoost.connect(this.kickGain)
    this.sineBoost.connect(this.kickGain)
    this.squareBoost.connect(this.kickGain)
  }

  private createOscillatorNode(type: OscillatorType): OscillatorNode {
    const osc = this.context.createOscillator()
    osc.type = type
    osc.frequency.setValueAtTime(0, this.context.currentTime)
    osc.start()

    this.frequencyConstant.connect(osc.frequency)

    return osc
  }

  private createBoostNode(value: number): GainNode {
    const boost = this.context.createGain()
    boost.gain.setValueAtTime(value, this.context.currentTime)

    return boost
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
    return this.kickGain
  }
}
