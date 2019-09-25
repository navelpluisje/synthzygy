
type SquareWaveType = {
  output: GainNode,
  fm: AudioParam,
  setFrequency(freq: number): void
}

function SquareWave(context: AudioContext, detune: number) {
  const ctx = context
  const cvFrequencyNode = new AudioWorkletNode(ctx, 'frequency-processor')
  setFrequency(10)

  const oscillatorNode = ctx.createOscillator()
  oscillatorNode.detune.setValueAtTime(detune, ctx.currentTime)
  oscillatorNode.type = 'square'
  oscillatorNode.start()

  const oscillatorGain = ctx.createGain()
  oscillatorGain.gain.setValueAtTime(5, ctx.currentTime)

  oscillatorNode.connect(oscillatorGain)
  cvFrequencyNode.connect(oscillatorNode.frequency)

  function setFrequency(freq: number) {
    cvFrequencyNode.parameters.get('frequency').setValueAtTime(freq, ctx.currentTime)
  }

  return {
    output: oscillatorGain,
    fm: cvFrequencyNode.parameters.get('fm'),
    setFrequency,
  }
}

export class HiHatNode {
  private volume: number = .5
  private decay: number = .1
  private context: AudioContext
  private hihatGain: GainNode
  private outputNode: GainNode

  private oscillator_1: SquareWaveType
  private oscillator_2: SquareWaveType
  private oscillator_3: SquareWaveType
  private oscillator_4: SquareWaveType

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createHihatNode()
  }

  private async createHihatNode() {
    this.oscillator_1 = SquareWave(this.context, 20)
    this.oscillator_2 = SquareWave(this.context, -20)
    this.oscillator_3 = SquareWave(this.context, 40)
    this.oscillator_4 = SquareWave(this.context, 0)

    this.hihatGain = this.context.createGain()
    this.hihatGain.gain.setValueAtTime(0, this.context.currentTime)

    this.outputNode = this.context.createGain()
    this.setVolume(this.volume)

    this.oscillator_1.output.connect(this.oscillator_2.fm)
    this.oscillator_2.output.connect(this.oscillator_3.fm)
    this.oscillator_3.output.connect(this.oscillator_4.fm)
    this.oscillator_4.output.connect(this.hihatGain)
    this.hihatGain.connect(this.outputNode)
  }

  public setVolume = (volume: number): void => {
    this.volume = volume
    this.outputNode.gain.setValueAtTime(this.volume, this.context.currentTime)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  public setFrequency = (frequency: number): void => {
    this.oscillator_1.setFrequency(frequency)
    this.oscillator_2.setFrequency(frequency)
    this.oscillator_3.setFrequency(frequency)
    this.oscillator_4.setFrequency(frequency)
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.hihatGain.gain.cancelAndHoldAtTime(0)
      this.hihatGain.gain.setValueCurveAtTime([0, 1], this.context.currentTime, 0.005)
      this.hihatGain.gain.setValueCurveAtTime([1, 0], this.context.currentTime + 0.005, this.decay)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.outputNode
  }
}
