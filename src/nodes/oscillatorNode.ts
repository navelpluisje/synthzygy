export interface JsOscillatorNode {
  // Controls
  setFrequency(frequency: number): void
  setDetune(detune: number): void
  setFm(fm: number): void
  setOctave(octave: number): void
  // Inputs
  inputCvFM(): GainNode
  inputCvFrequency(): AudioWorkletNode  // Outputs
  outputSaw(): GainNode
  outputSine(): GainNode
  outputSquare(): GainNode
  outputTriangle(): GainNode
}

export class JsOscillatorNode implements JsOscillatorNode {
  frequency: number
  detune: number
  fm: number
  octave: number
  range: 'octave' | 'full' = 'full'
  context: AudioContext
  squareWave: OscillatorNode
  squareBoost: GainNode
  sawWave: OscillatorNode
  sawBoost: GainNode
  sineWave: OscillatorNode
  sineBoost: GainNode
  triangleWave: OscillatorNode
  triangleBoost: GainNode
  cvFmNode: GainNode
  cvFrequencyNode: AudioWorkletNode
  detuneConstant: ConstantSourceNode

  constructor(
    context: AudioContext,
    frequency: number = 3,
    detune: number = 0,
    fm: number = 0,
    octave: number = 3,
  ) {
    this.context = context
    this.frequency = frequency
    this.detune = detune
    this.fm = fm
    this.octave = octave
    this.createGainNodes()
    this.createOscillators()
    this.connectNodes()
    this.setDefaultValues()
  }

  setDefaultValues() {
    this.setFrequency(this.frequency)
    this.setOctave(this.octave)
    this.setRange(this.range)
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

    this.squareWave.frequency.setValueAtTime(0, this.context.currentTime)
    this.sawWave.frequency.setValueAtTime(0, this.context.currentTime)
    this.sineWave.frequency.setValueAtTime(0, this.context.currentTime)
    this.triangleWave.frequency.setValueAtTime(0, this.context.currentTime)

    this.squareWave.start()
    this.sawWave.start()
    this.sineWave.start()
    this.triangleWave.start()
  }

  createGainNodes() {
    this.squareBoost = this.context.createGain()
    this.squareBoost.gain.setValueAtTime(5, this.context.currentTime)

    this.sawBoost = this.context.createGain()
    this.sawBoost.gain.setValueAtTime(5, this.context.currentTime)

    this.sineBoost = this.context.createGain()
    this.sineBoost.gain.setValueAtTime(5, this.context.currentTime)

    this.triangleBoost = this.context.createGain()
    this.triangleBoost.gain.setValueAtTime(5, this.context.currentTime)

    this.cvFmNode = this.context.createGain();
    this.cvFmNode.gain.setValueAtTime(1, this.context.currentTime)

    this.cvFrequencyNode = new AudioWorkletNode(this.context, 'frequency-processor')
  }

  connectNodes() {
    this.cvFmNode.connect(this.cvFrequencyNode.parameters.get('fm'))

    this.cvFrequencyNode.connect(this.squareWave.frequency)
    this.cvFrequencyNode.connect(this.sawWave.frequency)
    this.cvFrequencyNode.connect(this.sineWave.frequency)
    this.cvFrequencyNode.connect(this.triangleWave.frequency)

    this.squareWave.connect(this.squareBoost)
    this.sawWave.connect(this.sawBoost)
    this.sineWave.connect(this.sineBoost)
    this.triangleWave.connect(this.triangleBoost)
  }

  handleDetuneChange(): void {
    this.sawWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.sineWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.squareWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.triangleWave.detune.setValueAtTime(this.detune, this.context.currentTime)
  }

  setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.cvFrequencyNode.parameters.get('frequency').setValueAtTime(this.frequency, this.context.currentTime)
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
    this.cvFrequencyNode.parameters.get('octave').setValueAtTime(this.octave, this.context.currentTime)
  }

  setRange = (type: string | null) => {
    this.range = type ? 'full' : 'octave'
    this.cvFrequencyNode.parameters.get('range').setValueAtTime(this.range === 'full' ? 1 : 0, this.context.currentTime)
  }

  inputCvFrequency(): AudioWorkletNode {
    return this.cvFrequencyNode
  }

  inputCvFM(): GainNode {
    return this.cvFmNode
  }

  outputSaw(): GainNode {
    return this.sawBoost
  }

  outputSine(): GainNode {
    return this.sineBoost
  }

  outputSquare(): GainNode {
    return this.squareBoost
  }

  outputTriangle(): GainNode {
    return this.triangleBoost
  }
}