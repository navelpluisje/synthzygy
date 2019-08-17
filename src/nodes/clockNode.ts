export class ClockNode {
  private frequency: number = 10
  private pulseWidth: number = 0.5
  private trigger: Function
  private node: AudioWorkletNode
  private context: AudioContext
  private output: GainNode

  constructor(context: AudioContext) {
    this.context = context
    this.output = this.context.createGain()
    this.output.gain.setValueAtTime(0, this.context.currentTime)
    this.node = new AudioWorkletNode(this.context, 'clock-processor')
    this.setFrequency(this.frequency)
    this.setPulseWidth(this.pulseWidth)
    this.node.port.onmessage = this.handleMessage
    this.node.connect(this.output).connect(this.context.destination)
  }

  public setFrequency = (frequency: number) => {
    this.frequency = frequency
    this.node.parameters.get('frequency').setValueAtTime(frequency, this.context.currentTime)
  }

  public setPulseWidth = (pulseWidth: number) => {
    this.pulseWidth = pulseWidth
    this.node.parameters.get('pulseWidth').setValueAtTime(pulseWidth, this.context.currentTime)
  }

  private handleMessage = (event: MessageEvent) => {
    this.trigger && this.trigger(event.data.value)
  }

  public connect(trigger: Function): void {
    this.trigger = trigger
  }

  public disconnect() {
    this.trigger = null
  }

  public onKeyDown = () => {
    this.trigger && this.trigger(1)
  }

  public onKeyUp = () => {
    this.trigger && this.trigger(0)
  }
}