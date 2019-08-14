import { getNote } from "@utilities/keyBoardNotes";

export interface KeyboardNode {
  connect(trigger: Function): void
  disconnect(): void
  onKeyDown(event: KeyboardEvent): void
  onKeyUp(event: KeyboardEvent): void
  noteOutput(): AudioWorkletNode
}

export class KeyboardNode implements KeyboardNode {
  context: AudioContext
  trigger: Function
  cvNode: AudioWorkletNode
  connected: boolean = false

  constructor(context: AudioContext) {
    this.context = context
    this.createCvNode()
  }

  createCvNode() {
    this.cvNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvNode.parameters.get('value').setValueAtTime(0, this.context.currentTime)
  }

  connect(trigger: Function): void {
    this.trigger = trigger
    if (!this.connected) {
      this.addEventListeners()
      this.connected = true
    }
  }

  disconnect() {
    this.trigger = null
    if (this.connected) {
      this.removeEventListeners()
      this.connected = true
    }
  }

  addEventListeners = () => {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  removeEventListeners = () => {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  onKeyDown = (event: KeyboardEvent) => {
    const note = getNote(event.code)
    if (note > 0) {
      this.cvNode.parameters.get('value').setValueAtTime(note, this.context.currentTime)
      this.trigger && this.trigger(1)
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    this.trigger && this.trigger(0)
  }

  noteOutput(): AudioWorkletNode {
    return this.cvNode
  }
}