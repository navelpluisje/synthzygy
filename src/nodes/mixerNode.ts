export interface IMixerNode {
  // Controls
  setAudio(index: string): Function
  // In and Outputs
  connectInput(index: string): GainNode
  outputAudio(): GainNode
}

type MixerValues = {
  [key: string]: number,
}

export class MixerNode implements IMixerNode {
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
    this.audioIn1 = this.context.createGain()
    this.audioIn1.gain.setValueAtTime(0.5, this.context.currentTime)
    this.audioIn2 = this.context.createGain()
    this.audioIn2.gain.setValueAtTime(0.5, this.context.currentTime)
    this.audioIn3 = this.context.createGain()
    this.audioIn3.gain.setValueAtTime(0.5, this.context.currentTime)
    this.audioIn4 = this.context.createGain()
    this.audioIn4.gain.setValueAtTime(0.5, this.context.currentTime)

    this.audioOut = this.context.createGain()
    this.audioOut.gain.setValueAtTime(0.5, this.context.currentTime)
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

  connectInput(index: string): GainNode {
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

  outputAudio(): GainNode {
    return this.audioOut
  }
}