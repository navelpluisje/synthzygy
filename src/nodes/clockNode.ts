import { createGainNode } from "@utilities/createGain"

export class ClockNode {
  private frequency: number = 10
  private pulseWidth: number = 0.5
  private trigger: Record<number, Function> = {}
  private node: AudioWorkletNode
  private context: AudioContext
  private output: GainNode

  constructor(context: AudioContext) {
    this.context = context

    this.output = createGainNode(this.context, 0)

    this.node = new AudioWorkletNode(this.context, 'clock-processor')
    this.node.port.onmessage = this.handleMessage

    this.node.connect(this.output)
    this.output.connect(this.context.destination)

    this.setFrequency(this.frequency)
    this.setPulseWidth(this.pulseWidth)
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
    this.trigger && (
      Object.values(this.trigger).forEach(trigger => trigger(event.data.value))
    )
  }

  public connect(trigger: Function, id: number): void {
    this.trigger[id] = trigger
  }

  public disconnect(id: number) {
    this.trigger[id] = null
    delete this.trigger[id]
  }

  public onKeyDown = () => {
    this.trigger && (
      Object.values(this.trigger).forEach(trigger => trigger(1))
    )
  }

  public onKeyUp = () => {
    this.trigger && (
      Object.values(this.trigger).forEach(trigger => trigger(0))
    )
  }

  public getNode() {
    return this.node
  }
}