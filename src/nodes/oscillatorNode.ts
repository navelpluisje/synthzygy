export interface JsOscillatorNode {
  // Controls
  setFrequency(frequency: number): void
  setDetune(detune: number): void
  setFm(fm: number): void
  setOctave(octave: number): void
  // Inputs
  inputCvFM(): GainNode
  inputCvFrequency(): GainNode  // Outputs
  outputSaw(): OscillatorNode
  outputSine(): GainNode
  outputSquare(): OscillatorNode
  outputTriangle(): OscillatorNode
}

export class JsOscillatorNode implements JsOscillatorNode {
  frequency: number
  detune: number
  fm: number
  octave: number
  context: AudioContext
  squareWave: OscillatorNode
  sawWave: OscillatorNode
  sineWave: OscillatorNode
  triangleWave: OscillatorNode
  sineBoost: GainNode
  cvFmNode: GainNode
  cvFrequencyNode: GainNode
  detuneConstant: ConstantSourceNode

  constructor(
    context: AudioContext,
    frequency: number = 440,
    detune: number = 0,
    fm: number = 0,
    octave: number = 0,
  ) {
    this.context = context
    this.frequency = frequency
    this.detune = detune
    this.fm = fm
    this.octave = octave
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
  }

  createGainNodes() {
    this.sineBoost = this.context.createGain()
    this.sineBoost.gain.setValueAtTime(3, this.context.currentTime)

    this.cvFmNode = this.context.createGain();
    this.cvFmNode.gain.setValueAtTime(1, this.context.currentTime)

    this.cvFrequencyNode = this.context.createGain();
    this.cvFrequencyNode.gain.setValueAtTime(3, this.context.currentTime)
  }

  connectNodes() {
    this.cvFrequencyNode.connect(this.squareWave.frequency)
    this.cvFrequencyNode.connect(this.sawWave.frequency)
    this.cvFrequencyNode.connect(this.sineWave.frequency)
    this.cvFrequencyNode.connect(this.triangleWave.frequency)

    this.cvFmNode.connect(this.squareWave.frequency)
    this.cvFmNode.connect(this.sawWave.frequency)
    this.cvFmNode.connect(this.sineWave.frequency)
    this.cvFmNode.connect(this.triangleWave.frequency)

    this.sineWave.connect(this.sineBoost)
  }

    /**
   * Get the calculated frequency including the octave range
   * Octave goes from -2 to 2 in steps of 1
   * More info on notes and frequency calculations: https://pages.mtu.edu/~suits/NoteFreqCalcs.html
   *
   * @returns {number} The recalculated frequency for the oscillator
   * @memberof JsOscillatorNode
   */
  getFrequency(): number {
    return this.frequency * (2 ** this.octave)
  }

  handleFrequencyChange(): void {
    const frequency = this.getFrequency()
    this.sawWave.frequency.setValueAtTime(frequency, this.context.currentTime)
    this.sineWave.frequency.setValueAtTime(frequency, this.context.currentTime)
    this.squareWave.frequency.setValueAtTime(frequency, this.context.currentTime)
    this.triangleWave.frequency.setValueAtTime(frequency, this.context.currentTime)
  }

  handleDetuneChange(): void {
    this.sawWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.sineWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.squareWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.triangleWave.detune.setValueAtTime(this.detune, this.context.currentTime)
  }

  setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.handleFrequencyChange()
  }

  setDetune = (detune: number): void => {
    this.detune = detune
    this.handleDetuneChange()
  }

  setFm = (fm: number): void => {
    this.fm = fm
    this.cvFmNode.gain.setValueAtTime(this.fm, this.context.currentTime)
  }

  setOctave = (octave: number): void => {
    this.octave = octave
    this.handleFrequencyChange()
  }

  inputCvFrequency(): GainNode {
    return this.cvFrequencyNode
  }

  inputCvFM(): GainNode {
    return this.cvFmNode
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