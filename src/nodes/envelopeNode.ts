export interface EnvelopeNode {
  // Controls
  setAttack(attack: number): void
  setDecay(decay: number): void
  setSustain(sustain: number): void
  setRelease(release: number): void
  // Inputs
  connectGate(): Function
  connectAudioIn(): AudioParam | GainNode  // Outputs
}

export class EnvelopeNode implements EnvelopeNode {
  attack: number
  decay: number
  sustain: number
  release: number
  context: AudioContext
  gainNode: GainNode

  constructor(
    context: AudioContext,
    attack: number = 5,
    decay: number = 5,
    sustain: number = 5,
    release: number = 5,
    ) {
    this.context = context
    this.attack = attack
    this.decay = decay
    this.sustain = sustain
    this.release = release
    this.createGainNodes()
  }

  createGainNodes() {
    this.gainNode = this.context.createGain()
    this.gainNode.gain.setValueAtTime(0, this.context.currentTime)
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

  getAdsArray(start: number, base: number = 3000, spread: number = 0.1) {
    const from = start || base || 0
    const to = base > 0 ? base + this.decay + base * spread : this.decay
    const adsArray = new Float32Array(5)
    adsArray[0] = from
    adsArray[1] = Math.abs(to - from) * 0.333
    adsArray[2] = Math.abs(to - from) * 0.666
    adsArray[3] = to
    adsArray[4] = this.sustain * to
    return adsArray
  }

  trigger(value: number) {
    console.log(`Go envelope: ${value}`)
  }

  connect(): GainNode {
    return this.gainNode
  }

  connectGate(): Function {
    return this.trigger
  }

  output(): GainNode {
    return this.gainNode
  }
}