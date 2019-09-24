export class HiHatNode {
  private volume: number = .5
  private decay: number = .5
  private delayTime: number = .5
  private dryWet: number = .5
  private context: AudioContext
  private oscillator1Node: OscillatorNode
  private oscillator2Node: OscillatorNode
  private oscillator3Node: OscillatorNode
  private oscillator4Node: OscillatorNode
  private oscillator1Gain: GainNode
  private oscillator2Gain: GainNode
  private oscillator3Gain: GainNode
  private oscillator4Gain: GainNode
  private cvFrequency1Node: AudioWorkletNode
  private cvFrequency2Node: AudioWorkletNode
  private cvFrequency3Node: AudioWorkletNode
  private cvFrequency4Node: AudioWorkletNode
  private hihatGain: GainNode
  private outputNode: GainNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createSnareNode()
  }

  private async createSnareNode() {
    this.cvFrequency1Node = new AudioWorkletNode(this.context, 'frequency-processor')
    this.cvFrequency2Node = new AudioWorkletNode(this.context, 'frequency-processor')
    this.cvFrequency3Node = new AudioWorkletNode(this.context, 'frequency-processor')
    this.cvFrequency4Node = new AudioWorkletNode(this.context, 'frequency-processor')

    this.oscillator1Node = this.context.createOscillator()
    this.oscillator1Node.type = 'square'
    this.cvFrequency1Node.parameters.get('frequency').setValueAtTime(5900, this.context.currentTime)
    this.oscillator1Node.start()

    this.oscillator1Gain = this.context.createGain()
    this.oscillator1Gain.gain.setValueAtTime(5, this.context.currentTime)

    this.oscillator2Node = this.context.createOscillator()
    this.oscillator2Node.type = 'square'
    this.cvFrequency2Node.parameters.get('frequency').setValueAtTime(5900, this.context.currentTime)
    this.oscillator2Node.detune.setValueAtTime(20, this.context.currentTime)
    this.oscillator2Node.start()

    this.oscillator2Gain = this.context.createGain()
    this.oscillator2Gain.gain.setValueAtTime(5, this.context.currentTime)

    this.oscillator3Node = this.context.createOscillator()
    this.oscillator3Node.type = 'square'
    this.cvFrequency3Node.parameters.get('frequency').setValueAtTime(5900, this.context.currentTime)
    this.oscillator3Node.detune.setValueAtTime(-20, this.context.currentTime)
    this.oscillator3Node.start()

    this.oscillator3Gain = this.context.createGain()
    this.oscillator3Gain.gain.setValueAtTime(5, this.context.currentTime)

    this.oscillator4Node = this.context.createOscillator()
    this.oscillator4Node.type = 'square'
    this.cvFrequency4Node.parameters.get('frequency').setValueAtTime(5900, this.context.currentTime)
    this.oscillator4Node.detune.setValueAtTime(40, this.context.currentTime)
    this.oscillator4Node.start()

    this.oscillator4Gain = this.context.createGain()
    this.oscillator4Gain.gain.setValueAtTime(5, this.context.currentTime)

    this.hihatGain = this.context.createGain()
    this.hihatGain.gain.setValueAtTime(0, this.context.currentTime)

    this.outputNode = this.context.createGain()
    this.setVolume(this.volume)

    this.oscillator1Node.connect(this.oscillator1Gain)
    this.oscillator2Node.connect(this.oscillator2Gain)
    this.oscillator3Node.connect(this.oscillator3Gain)
    this.oscillator4Node.connect(this.oscillator4Gain)
    this.cvFrequency1Node.connect(this.oscillator1Node.frequency)
    this.cvFrequency2Node.connect(this.oscillator2Node.frequency)
    this.cvFrequency3Node.connect(this.oscillator3Node.frequency)
    this.cvFrequency4Node.connect(this.oscillator4Node.frequency)
    this.oscillator1Gain.connect(this.cvFrequency2Node.parameters.get('fm'))
    this.oscillator2Gain.connect(this.cvFrequency3Node.parameters.get('fm'))
    this.oscillator3Gain.connect(this.cvFrequency4Node.parameters.get('fm'))
    this.oscillator4Gain.connect(this.cvFrequency4Node.parameters.get('fm'))

    this.oscillator4Gain.connect(this.hihatGain)
    this.hihatGain.connect(this.outputNode)
  }

  private getFrequency(range: number, oct: number, freq: number): number {
    const octave = range === 1 ? Math.floor(freq) : oct
    const frequency = range === 1 ? freq % 1 : freq / 10

    return ((16.35 + (16.35 * frequency)) * (2 ** octave))
  }

  public setVolume = (volume: number): void => {
    this.volume = volume
    this.outputNode.gain.setValueAtTime(this.volume, this.context.currentTime)
  }

  public setDecay = (decay: number): void => {
    this.decay = decay
  }

  private trigger = (value: number): void => {
    if (value === 1) {
      this.hihatGain.gain.cancelAndHoldAtTime(0)
      this.hihatGain.gain.setValueCurveAtTime([0, 1], this.context.currentTime, 0.001)
      this.hihatGain.gain.setValueCurveAtTime([1, 0], this.context.currentTime + 0.001, 0.1)
    }
  }

  public inputGate(): Function {
    return this.trigger
  }

  public output(): GainNode {
    return this.outputNode
  }
}
