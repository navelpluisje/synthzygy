import { createGainNode } from "@utilities/createGain"

export class BitCrusherNode {
  private bitDepth: number = 8
  private frequencyReduction: number = .5
  private dryWet: number = .5
  private level: number = .5
  private context: AudioContext
  private inputNode: GainNode
  private outputNode: GainNode
  private dryNode: GainNode
  private wetNode: GainNode
  private bitCrusherNode: AudioWorkletNode

  public constructor(
    context: AudioContext,
  ) {
    this.context = context
    this.createBitCrusherNode()
  }

  private createBitCrusherNode() {
    this.inputNode = createGainNode(this.context, 1)
    this.outputNode = createGainNode(this.context, 1)

    this.bitCrusherNode = new AudioWorkletNode(this.context, 'bitcrusher-processor')
    this.setBitDepth(this.bitDepth)
    this.setFrequencyReduction(this.frequencyReduction)

    this.dryNode = createGainNode(this.context, 0)
    this.wetNode = createGainNode(this.context, 0)
    this.setDryWet(this.dryWet)

    this.inputNode.connect(this.bitCrusherNode)
    this.bitCrusherNode.connect(this.wetNode)
    this.inputNode.connect(this.dryNode)
    this.dryNode.connect(this.outputNode)
    this.wetNode.connect(this.outputNode)
  }

  public setBitDepth = (bitDepth: number): void => {
    this.bitDepth = bitDepth
    this.bitCrusherNode.parameters.get('bitDepth').setValueAtTime(this.bitDepth, this.context.currentTime)
  }

  public setFrequencyReduction = (frequencyReduction: number): void => {
    this.frequencyReduction = frequencyReduction
    this.bitCrusherNode.parameters.get('frequencyReduction').setValueAtTime(this.frequencyReduction, this.context.currentTime)
  }

  public setDryWet = (dryWet: number): void => {
    this.dryWet = dryWet
    this.dryNode.gain.setValueAtTime(1 - this.dryWet, this.context.currentTime)
    this.wetNode.gain.setValueAtTime(this.dryWet, this.context.currentTime)
  }

  public setOutputLevel = (level: number): void => {
    this.level = level
    this.outputNode.gain.setValueAtTime(this.level, this.context.currentTime)
  }

  public input(): GainNode {
    return this.inputNode
  }

  public output(): GainNode {
    return this.outputNode
  }
}
