import { createOscillatorNode } from "@utilities/createOscillator"
import { createGainNode } from "@utilities/createGain"

export class JsOscillatorNode {
  private frequency: number
  private detune: number
  private fm: number
  private octave: number
  private range: 'octave' | 'full' = 'full'
  private context: AudioContext
  private squareWave: OscillatorNode
  private squareBoost: GainNode
  private sawWave: OscillatorNode
  private sawBoost: GainNode
  private sineWave: OscillatorNode
  private sineBoost: GainNode
  private triangleWave: OscillatorNode
  private triangleBoost: GainNode
  private cvFmNode: GainNode
  private cvFrequencyNode: AudioWorkletNode
  private detuneConstant: ConstantSourceNode

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

  private setDefaultValues() {
    this.setFrequency(this.frequency)
    this.setOctave(this.octave)
    this.setRange(this.range)
  }

  private createOscillators() {
    this.squareWave = createOscillatorNode(this.context, 'square', 0)
    this.sawWave = createOscillatorNode(this.context, 'sawtooth', 0)
    this.sineWave = createOscillatorNode(this.context, 'sine', 0)
    this.triangleWave = createOscillatorNode(this.context, 'triangle', 0)
  }

  private createGainNodes() {
    this.squareBoost = createGainNode(this.context, 5)
    this.sawBoost = createGainNode(this.context, 5)
    this.sineBoost = createGainNode(this.context, 5)
    this.triangleBoost = createGainNode(this.context, 5)
    this.cvFmNode = createGainNode(this.context, 1)

    this.cvFrequencyNode = new AudioWorkletNode(this.context, 'frequency-processor')
  }

  private connectNodes() {
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

  private handleDetuneChange(): void {
    this.sawWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.sineWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.squareWave.detune.setValueAtTime(this.detune, this.context.currentTime)
    this.triangleWave.detune.setValueAtTime(this.detune, this.context.currentTime)
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.cvFrequencyNode.parameters.get('frequency').setValueAtTime(this.frequency, this.context.currentTime)
  }

  public setDetune = (detune: number): void => {
    this.detune = detune
    this.handleDetuneChange()
  }

  public setFm = (fm: number): void => {
    this.fm = fm
    this.cvFmNode.gain.setValueAtTime(this.fm, this.context.currentTime)
  }

  public setOctave = (octave: number): void => {
    this.octave = octave
    this.cvFrequencyNode.parameters.get('octave').setValueAtTime(this.octave, this.context.currentTime)
  }

  public setRange = (type: string | null) => {
    this.range = type ? 'full' : 'octave'
    this.cvFrequencyNode.parameters.get('range').setValueAtTime(this.range === 'full' ? 1 : 0, this.context.currentTime)
  }

  public inputCvFrequency(): AudioWorkletNode {
    return this.cvFrequencyNode
  }

  public inputCvFM(): GainNode {
    return this.cvFmNode
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