export interface FilterNode {
  // Controls
  setFrequency(frequency: number): void
  setQ(q: number): void
  setFilterType(type: BiquadFilterType): void
  setInputLevel(level: number): void
  setCvFrequency(amount: number): void
  setCvQ(amount: number): void
  // Inputs
  connectFrequency(): AudioParam
  connectQ(): AudioParam
  output(): BiquadFilterNode
}

export class FilterNode implements FilterNode {
  frequency: number
  q: number
  type: BiquadFilterType
  context: AudioContext
  filterNode: BiquadFilterNode
  qConstant: GainNode
  frequencyConstant: GainNode
  detuneConstant: ConstantSourceNode

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
  }

  setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.filterNode.frequency.setValueAtTime(this.frequency, this.context.currentTime)
  }

  setQ = (q: number): void => {
    this.q = q
    this.filterNode.Q.setValueAtTime(this.q, this.context.currentTime)
  }

  setFilterType = (type: BiquadFilterType): void => {
    this.type = type
    this.filterNode.type = this.type
  }

  setInputLevel(level: number): void {
    // TODO: add funcionalty
  }

  setCvFrequency(amount: number): void {
    // TODO: add funcionalty
  }

  SetCvQ(amount: number): void {
    // TODO: add funcionalty
  }

  connectFrequency(): AudioParam {
    return this.filterNode.frequency
  }

  connectQ(): AudioParam {
    return this.filterNode.Q
  }

  output(): BiquadFilterNode {
    return this.filterNode
  }
}