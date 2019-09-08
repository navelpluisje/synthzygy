import { GateNode } from "./gateNode";

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
  outputGate(): GateNode
}

export class SequencerNode implements SequencerNode {
  private stepsA: Float32Array = new Float32Array([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
  private stepsB: Float32Array = new Float32Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
  private gates: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  private length: number = 16
  private running: boolean = false
  private currentStep: number = 0
  private glideEnabled: boolean = false
  private glideDuration: number = 0
  private context: AudioContext
  private cvOutputNodeA: AudioWorkletNode
  private cvOutputNodeB: AudioWorkletNode
  private gateOutput: GateNode

  constructor(
    context: AudioContext,
    ) {
    this.context = context
    this.gateOutput = new GateNode()
    this.createCvOutputNodes()
  }

  setLength(length: number):void {
    this.length = length
  }

  start(): void {
    this.running = !this.running
  }

  stop(): void {
    this.running = false
    this.currentStep = 0
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

  setStepAValue(index: number, group: 'A' | 'B', value: number) {
    switch(group) {
      case 'A':
        this.stepsA[index] = value
        break
      case 'B':
        this.stepsB[index] = value
        break
      default:
        this.stepsA[index] = value
    }
  }

  setGateStep(index: number, value: boolean) {
    this.gates[index] = value
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

  public handleTransportClick = (value: string) => {
    switch (value) {
      case 'start':
        this.start()
        break
      case 'stop':
        this.stop()
        break
      case 'reset':
        this.reset()
        break
      default:
        console.warn(`Invalid value (${value}) given for 'handleTransportClick'. Should be: start, stop or reset`)
    }
  }

  trigger = (value: number) => {
    if (!this.running) {
      return
    }

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
    if (this.gates[this.currentStep]) {
      if (value === 1) {
        this.gateOutput.onKeyDown()
      } else {
        this.gateOutput.onKeyUp()
      }
    }
  }

  public getStepValues(group: 'A' | 'B'): Float32Array {
    switch(group) {
      case 'A':
        return this.stepsA
      case 'B':
        return this.stepsB
      default:
        return this.stepsA
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

  outputGate(): GateNode {
    return this.gateOutput
  }
}