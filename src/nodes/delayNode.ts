export class DelayerNode {
  private feedback: number = .6
  private frequency: number = 2000
  private delayTime: number = .5
  private dryWet: number = .5
  private context: AudioContext
  private inputNode: GainNode
  private outputNode: GainNode
  private dryNode: GainNode
  private wetNode: GainNode
  private dryWetNode: AudioWorkletNode
  private delayNode: DelayNode
  private feedbackNode: GainNode
  private filterNode: BiquadFilterNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createDelayNode()
  }

  private createDelayNode() {
    this.inputNode = this.context.createGain()
    this.inputNode.gain.setValueAtTime(1, this.context.currentTime)
    this.outputNode = this.context.createGain()
    this.outputNode.gain.setValueAtTime(1, this.context.currentTime)

    this.delayNode = this.context.createDelay(6.0)
    this.setDelayTime(this.delayTime)

    this.feedbackNode = this.context.createGain()
    this.setFeedback(this.feedback)

    this.filterNode = this.context.createBiquadFilter()
    this.filterNode.Q.setValueAtTime(0, this.context.currentTime)
    this.setFrequency(this.frequency)

    this.dryNode = this.context.createGain()
    this.wetNode = this.context.createGain()
    this.setDryWet(this.dryWet)
    // this.dryWetNode = new AudioWorkletNode(this.context, 'dry-wet-processor')
    // this.setDryWet(this.dryWet)

    this.inputNode.connect(this.filterNode)
    this.filterNode.connect(this.delayNode)
    this.delayNode.connect(this.feedbackNode)
    this.feedbackNode.connect(this.filterNode)
    this.delayNode.connect(this.wetNode)
    this.inputNode.connect(this.dryNode)
    this.dryNode.connect(this.outputNode)
    this.wetNode.connect(this.outputNode)
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = frequency
    this.filterNode.frequency.setValueAtTime(this.frequency, this.context.currentTime)
  }

  public setFeedback = (feedback: number): void => {
    this.feedback = feedback
    this.feedbackNode.gain.setValueAtTime(this.feedback, this.context.currentTime)
  }

  public setDryWet = (dryWet: number): void => {
    this.dryWet = dryWet
    this.dryNode.gain.setValueAtTime(1 - this.dryWet, this.context.currentTime)
    this.wetNode.gain.setValueAtTime(this.dryWet, this.context.currentTime)
  }

  public setDelayTime = (delayTime: number): void => {
    this.delayTime = delayTime
    this.delayNode.delayTime.value = this.delayTime
  }

  public inputCvFeedback(): AudioParam {
    return this.feedbackNode.gain
  }

  public input(): GainNode {
    return this.inputNode
  }

  public output(): GainNode {
    return this.outputNode
  }
}
