import { GateNode } from "./gateNode";
import { Transport } from "@constants/enums";

export class SequencerNode {
  private stepsA: Float32Array = new Float32Array([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
  private stepsB: Float32Array = new Float32Array([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2])
  private gates: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
  private length: number = 16
  private running: boolean = false
  private currentStep: number = -1
  private glideEnabled: boolean = false
  private glideDuration: number = 0
  private context: AudioContext
  private cvOutputNodeA: ConstantSourceNode
  private cvOutputNodeB: ConstantSourceNode
  private gateOutput: GateNode
  private transportCallback: Function
  private stepChangeCallback: (step: number) => void

  constructor(
    context: AudioContext,
    stepChangeCallback: (step: number) => void,
    ) {
    this.context = context
    this.gateOutput = new GateNode()
    this.createCvOutputNodes()
    this.stepChangeCallback = stepChangeCallback
  }

  public setLength(length: number):void {
    this.length = length
  }

  public start(): void {
    this.running = true
  }

  public stop(): void {
    this.running = false
  }

  public reset(): void {
    this.currentStep = -1
  }

  public setStepValue(index: number, group: 'A' | 'B', value: number) {
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

  public setGateStep(index: number, value: boolean) {
    this.gates[index] = value
  }

  private createCvOutputNodes() {
    this.cvOutputNodeA = this.context.createConstantSource()
    this.cvOutputNodeA.offset.setValueAtTime(0, this.context.currentTime)
    this.cvOutputNodeA.start()
    this.cvOutputNodeB = this.context.createConstantSource()
    this.cvOutputNodeB.offset.setValueAtTime(0, this.context.currentTime)
    this.cvOutputNodeB.start()
  }

  private setNextStep() {
    if (this.currentStep === this.length - 1) {
      this.currentStep = 0
    } else {
      this.currentStep += 1
    }
    this.stepChangeCallback(this.currentStep)
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

  private trigger = (value: number) => {
    if (!this.running) {
      return
    }

    if (value === 1) {
      this.setNextStep()
      // this.cvOutputNodeA.parameters.get('value').setValueAtTime(
      this.cvOutputNodeA.offset.setValueAtTime(
        this.stepsA[this.currentStep],
        this.context.currentTime
      )
      // this.cvOutputNodeB.parameters.get('value').setValueAtTime(
      this.cvOutputNodeB.offset.setValueAtTime(
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

  public triggerTransport = (mode: Transport) => {
    switch (mode) {
      case Transport.Stop:
        this.stop()
        break
      case Transport.Start:
        this.reset()
        this.start()
        break
      case Transport.Continue:
        this.start()
        break
    }
    this.transportCallback(mode)
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

  public cvStartStop(transportCallback: Function): Function {
    this.transportCallback = transportCallback
    return this.triggerTransport
  }

  public inputGate(): Function {
    return this.trigger
  }

  public outputA(): ConstantSourceNode {
    return this.cvOutputNodeA
  }

  public outputB(): ConstantSourceNode {
    return this.cvOutputNodeB
  }

  public outputGate(): GateNode {
    return this.gateOutput
  }
}