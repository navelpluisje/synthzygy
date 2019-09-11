export interface LfoNode {
  // Controls
  setFrequency(frequency: number): void
  // Outputs
  outputSaw(): GainNode
  outputSine(): GainNode
  outputSquare(): GainNode
  outputTriangle(): GainNode
}

export class LfoNode implements LfoNode {
  frequency: number
  context: AudioContext
  squareWave: OscillatorNode
  squareBoost: GainNode
  sawWave: OscillatorNode
  sawBoost: GainNode
  sineWave: OscillatorNode
  sineBoost: GainNode
  triangleWave: OscillatorNode
  triangleBoost: GainNode
  frequencyConstant: GainNode

  constructor(
    context: AudioContext,
    frequency: number = 5,
  ) {
    this.context = context
    this.frequency = frequency
    this.createGainNodes()
    this.createOscillators()
    this.connectNodes()
  }

  private createOscillators() {
    this.squareWave = this.context.createOscillator()
    this.sawWave = this.context.createOscillator()
    this.sineWave = this.context.createOscillator()
    this.triangleWave = this.context.createOscillator()

    this.squareWave.type = 'square'
    this.sawWave.type = 'sawtooth'
    this.sineWave.type = 'sine'
    this.triangleWave.type = 'triangle'

    this.squareWave.start()
    this.sawWave.start()
    this.sineWave.start()
    this.triangleWave.start()

    this.handleFrequencyChange()
  }

  private createGainNodes() {
    this.squareBoost = this.context.createGain()
    this.squareBoost.gain.setValueAtTime(2.5, this.context.currentTime)

    this.sawBoost = this.context.createGain()
    this.sawBoost.gain.setValueAtTime(2.5, this.context.currentTime)

    this.sineBoost = this.context.createGain()
    this.sineBoost.gain.setValueAtTime(2.5, this.context.currentTime)

    this.triangleBoost = this.context.createGain()
    this.triangleBoost.gain.setValueAtTime(2.5, this.context.currentTime)

    this.frequencyConstant = this.context.createGain()
    this.frequencyConstant.gain.setValueAtTime(10, this.context.currentTime)
  }

  private connectNodes() {
    this.frequencyConstant.connect(this.squareWave.frequency)
    this.frequencyConstant.connect(this.sawWave.frequency)
    this.frequencyConstant.connect(this.sineWave.frequency)
    this.frequencyConstant.connect(this.triangleWave.frequency)

    this.squareWave.connect(this.squareBoost)
    this.sawWave.connect(this.sawBoost)
    this.sineWave.connect(this.sineBoost)
    this.triangleWave.connect(this.triangleBoost)
  }

  private handleFrequencyChange(): void {
    this.sawWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
    this.sineWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
    this.squareWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
    this.triangleWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = Math.max(frequency, 0.01)
    this.handleFrequencyChange()
  }

  public outputSaw(): GainNode {
    return this.sawBoost
  }

  public outputSine(): GainNode {
    return this.sineBoost
  }

  public outputSquare(): GainNode {
    return this.squareBoost
  }

  public outputTriangle(): GainNode {
    return this.triangleBoost
  }
}