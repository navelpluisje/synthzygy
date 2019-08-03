export interface EnvelopeNode {
  // Controls
  setAttack(attack: number): void
  setDecay(decay: number): void
  setSustain(sustain: number): void
  setRelease(release: number): void
  // Inputs
  inputGate(): Function
  outputCv(): AudioWorklet
}

export class EnvelopeNode implements EnvelopeNode {
  attack: number
  decay: number
  sustain: number
  release: number
  context: AudioContext
  gateNode: AudioWorkletNode

  constructor(
    context: AudioContext,
    attack: number = 1,
    decay: number = 1,
    sustain: number = .5,
    release: number = 5,
    ) {
    this.context = context
    this.attack = attack
    this.decay = decay
    this.sustain = sustain
    this.release = release
    this.createGateNode()
  }

  createGateNode() {
    this.gateNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.gateNode.parameters.get('value').setValueAtTime(0, this.context.currentTime)
  }

  setAttack = (attack: number): void => {
    this.attack = attack
  }

  setDecay = (decay: number): void => {
    this.decay = decay
  }

  setSustain = (sustain: number): void => {
    this.sustain = sustain
  }

  setRelease = (release: number): void => {
    this.release = release
  }

  getAdsArray(): Float32Array {
    const from = this.gateNode.parameters.get('value').value || 0
    const to = this.sustain
    const attackSteps = Math.floor(this.attack * 100)
    const decaySteps = Math.floor(this.decay * 100)
    const adsArray = new Float32Array(attackSteps + decaySteps)
    for (let i = 0; i < attackSteps; i += 1) {
      adsArray[i] = (from + ((1 - from) / attackSteps) * i)
    }
    for (let i = 0; i < decaySteps; i += 1) {
      adsArray[i + attackSteps] = 1 + ((this.sustain - 1) / decaySteps) * i
    }
    console.log({from, to, attackSteps, decaySteps})
    console.log(adsArray)
    return adsArray
  }

  getAdsTime(): number {
    const adsTime = this.attack + this.decay
    return adsTime > 0 ? adsTime : 0.0001
  }

  getReleaseArray(): Float32Array {
    const from = this.gateNode.parameters.get('value').value || this.sustain
    const to = 0
    const releaseArray = new Float32Array(2)
    releaseArray[0] = from
    releaseArray[1] = to
    return releaseArray
  }

  getReleaseTime(): number {
    return this.release > 0 ? this.release : 0.0001
  }

  trigger = (value: number) => {
    this.gateNode.parameters.get('value').cancelAndHoldAtTime(0)
    if (value === 1) {
      this.gateNode.parameters.get('value').setValueCurveAtTime(
        this.getAdsArray(),
        this.context.currentTime,
        this.getAdsTime() || 0.0001,
      )
    }
    if (value === 0) {
      this.gateNode.parameters.get('value').setValueCurveAtTime(
        this.getReleaseArray(),
        this.context.currentTime,
        this.getReleaseTime() || 0.0001,
      )
    }

  }

  inputGate(): Function {
    return this.trigger
  }

  output(): AudioWorkletNode {
    return this.gateNode
  }
}