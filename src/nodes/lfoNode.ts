export interface IJsLfoNode {
  // Controls
  setFrequency(frequency: number): void
  // Outputs
  outputSaw(): OscillatorNode
  outputSine(): GainNode
  outputSquare(): OscillatorNode
  outputTriangle(): OscillatorNode
}

export class JsLfoNode implements IJsLfoNode {
  frequency: number
  context: AudioContext
  squareWave: OscillatorNode
  sawWave: OscillatorNode
  sineWave: OscillatorNode
  triangleWave: OscillatorNode
  sineBoost: GainNode
  frequencyConstant: GainNode

  constructor(
    context: AudioContext,
    frequency: number = 0,
  ) {
    this.context = context
    this.frequency = frequency
    this.createGainNodes()
    this.createOscillators()
    this.connectNodes()
  }

  createOscillators() {
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

  createGainNodes() {
    this.sineBoost = this.context.createGain()
    this.sineBoost.gain.setValueAtTime(3, this.context.currentTime)

    this.frequencyConstant = this.context.createGain()
    this.frequencyConstant.gain.setValueAtTime(10, this.context.currentTime)
  }

  connectNodes() {
    this.frequencyConstant.connect(this.squareWave.frequency)
    this.frequencyConstant.connect(this.sawWave.frequency)
    this.frequencyConstant.connect(this.sineWave.frequency)
    this.frequencyConstant.connect(this.triangleWave.frequency)

    this.sineWave.connect(this.sineBoost)
  }

  handleFrequencyChange(): void {
    this.sawWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
    this.sineWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
    this.squareWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
    this.triangleWave.frequency.setValueAtTime(this.frequency, this.context.currentTime)
  }

  setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.handleFrequencyChange()
  }

  outputSaw(): OscillatorNode {
    return this.sawWave
  }

  outputSine(): GainNode {
    return this.sineBoost
  }

  outputSquare(): OscillatorNode {
    return this.squareWave
  }

  outputTriangle(): OscillatorNode {
    return this.triangleWave
  }
}