import { createGainNode } from "@utilities/createGain"

export interface MixerNode {
  // Controls
  setAudio(index: string): Function
  // In and Outputs
  connectInput(index: string): GainNode
  outputAudio(): GainNode
}

type MixerValues = {
  [key: string]: number,
}

export class MixerNode implements MixerNode {
  context: AudioContext
  audioIn1: GainNode
  audioIn2: GainNode
  audioIn3: GainNode
  audioIn4: GainNode
  audioOut: GainNode

  values: MixerValues = {
    '1': 0.5,
    '2': 0.5,
    '3': 0.5,
    '4': 0.5,
    'out': 0.5,
  }

  constructor(
    context: AudioContext,
    frequency: number = 0,
  ) {
    this.context = context
    this.createGainNodes()
    this.connectNodes()
  }

  createGainNodes() {
    this.audioIn1 = createGainNode(this.context, 0.5)
    this.audioIn2 = createGainNode(this.context, 0.5)
    this.audioIn3 = createGainNode(this.context, 0.5)
    this.audioIn4 = createGainNode(this.context, 0.5)

    this.audioOut = createGainNode(this.context, 0.5)
  }

  connectNodes() {
    this.audioIn1.connect(this.audioOut)
    this.audioIn2.connect(this.audioOut)
    this.audioIn3.connect(this.audioOut)
    this.audioIn4.connect(this.audioOut)
  }

  getAudioNode(index: string) {
    switch (index) {
      case '1':
        return this.audioIn1
      case '2':
        return this.audioIn2
      case '3':
        return this.audioIn3
      case '4':
        return this.audioIn4
      case 'out':
        return this.audioOut
    }
  }

  setAudio = (index: string): Function => {
    return (value: number) => {
      this.values[index.toString()] = value
      this.getAudioNode(index).gain.setValueAtTime(value, this.context.currentTime)
    }
  }

  input(index: string): GainNode {
    switch (index) {
      case '1':
        return this.audioIn1
      case '2':
        return this.audioIn2
      case '3':
        return this.audioIn3
      case '4':
        return this.audioIn4
    }
  }

  output(): GainNode {
    return this.audioOut
  }
}