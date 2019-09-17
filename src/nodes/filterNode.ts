import { inputTypes } from "@modules/oscillator/inputs";

export interface FilterNode {
  // Controls
  setFrequency(frequency: number): void
  setQ(q: number): void
  setFilterType(type: BiquadFilterType): void
  setInputLevel(level: number): void
  setCvFrequency(amount: number): void
  setCvQ(amount: number): void
  // Inputs
  inputCvFrequency(): GainNode
  inputCvQ(): GainNode
  input(): BiquadFilterNode
  output(): BiquadFilterNode
}

export class FilterNode implements FilterNode {
  frequency: number
  q: number
  level: number
  cvFreq: number
  cvQ: number
  type: BiquadFilterType
  context: AudioContext
  filterNode: BiquadFilterNode
  cvFreqNode: GainNode
  cvQNode: GainNode
  levelNode: GainNode
  frequencyNode: AudioWorkletNode

  constructor(
    context: AudioContext,
    frequency: number = 440,
  ) {
    this.context = context
    this.frequency = frequency
    this.createFilterNode()
  }

  createFilterNode() {
    this.filterNode = this.context.createBiquadFilter()
    this.filterNode.frequency.setValueAtTime(0, this.context.currentTime)
    this.filterNode.Q.setValueAtTime(20, this.context.currentTime)
    this.filterNode.gain.setValueAtTime(3, this.context.currentTime)

    this.levelNode = this.context.createGain()
    this.levelNode.gain.setValueAtTime(1, this.context.currentTime)

    this.cvFreqNode = this.context.createGain()
    this.cvFreqNode.gain.setValueAtTime(0, this.context.currentTime)

    this.cvQNode = this.context.createGain()
    this.cvQNode.gain.setValueAtTime(5, this.context.currentTime)

    this.frequencyNode = new AudioWorkletNode(this.context, 'frequency-processor')
    this.setCvFrequency(4)

    this.levelNode.connect(this.filterNode)
    this.frequencyNode.connect(this.filterNode.frequency)
    this.cvFreqNode.connect(this.frequencyNode.parameters.get('fm'))
    this.cvQNode.connect(this.filterNode.Q)
  }

  setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.frequencyNode.parameters.get('frequency').setValueAtTime(this.frequency, this.context.currentTime)
  }

  setQ = (q: number): void => {
    this.q = q
    this.filterNode.Q.setValueAtTime(this.q, this.context.currentTime)
  }

  setFilterType = (type: BiquadFilterType): void => {
    this.type = type
    this.filterNode.type = this.type
  }

  setInputLevel = (level: number): void => {
    this.level = level
    this.levelNode.gain.setValueAtTime(this.level, this.context.currentTime)
  }

  setCvFrequency = (amount: number): void => {
    this.cvFreq = amount
    this.cvFreqNode.gain.setValueAtTime(this.cvFreq, this.context.currentTime)
  }

  SetCvQ = (amount: number): void => {
    this.cvQ = amount
    this.cvQNode.gain.setValueAtTime(this.cvQ, this.context.currentTime)
  }

  inputCvFrequency(): GainNode {
    return this.cvFreqNode
  }

  inputCvQ(): GainNode {
    return this.cvQNode
  }

  input(): GainNode {
    return this.levelNode
  }

  output(): BiquadFilterNode {
    return this.filterNode
  }
}