export interface SequencerNode {
  // Controls
  setStepA(index: number, value: number): void
  setStepB(index: number, value: number): void
  setLength(length: number): void
  setGlideLength(length: number): void
  toggleGlide(): void
  setGlideDuration(duration: number): void
  start(): void
  stop(): void
  reset(): void
  isRunning(): boolean
  // Inputs
  inputGate(): Function
  //outputs
  outputA(): AudioWorkletNode
  outputB(): AudioWorkletNode
  outputGate(): GainNode
}

export class SequencerNode implements SequencerNode {
  private stepsA: Float32Array = new Float32Array([
    110,
    220,
    330,
    440,
    330,
    220,
    110,
    220,
    330,
    440,
    330,
    220,
    110,
    220,
    330,
    440,
    330,
  ])
  private stepsB: Float32Array = new Float32Array(16)
  private length: number = 16
  private running: boolean = false
  private currentStep: number = 0
  private glideEnabled: boolean = false
  private glideDuration: number = 0
  private context: AudioContext
  private cvOutputNodeA: AudioWorkletNode
  private cvOutputNodeB: AudioWorkletNode

  constructor(
    context: AudioContext,
    ) {
    this.context = context
    this.createCvOutputNodes()
  }

  setLength(length: number):void {
    this.length = length
  }

  start(): void {
    this.running = true
  }

  stop(): void {
    this.running = false
  }

  reset(): void {
    this.currentStep = 0
  }

  isRunning(): boolean {
    return this.running
  }

  toggleGlide() {
    this.glideEnabled = !this.glideEnabled
  }

  setGlideDuration(duration: number): void {
    this.glideDuration = duration
  }

  private createCvOutputNodes() {
    this.cvOutputNodeA = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvOutputNodeA.parameters.get('value').setValueAtTime(0, this.context.currentTime)
    this.cvOutputNodeB = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvOutputNodeB.parameters.get('value').setValueAtTime(0, this.context.currentTime)
  }

  private setNextStep() {
    if (this.currentStep === this.length - 1) {
      this.currentStep = 0
    } else {
      this.currentStep += 1
    }
  }

  trigger = (value: number) => {
    if (value === 1) {
      this.setNextStep()
      this.cvOutputNodeA.parameters.get('value').setValueAtTime(
        this.stepsA[this.currentStep],
        this.context.currentTime
      )
      this.cvOutputNodeB.parameters.get('value').setValueAtTime(
        this.stepsB[this.currentStep],
        this.context.currentTime
      )
    }
  }

  inputGate(): Function {
    return this.trigger
  }

  outputA(): AudioWorkletNode {
    return this.cvOutputNodeA
  }

  outputB(): AudioWorkletNode {
    return this.cvOutputNodeB
  }
}