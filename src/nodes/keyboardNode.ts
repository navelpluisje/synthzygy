import { getNote } from "@utilities/keyBoardNotes";
import { createConstantSourceNode } from "@utilities/createConstantSource";

export class KeyboardNode {
  context: AudioContext
  trigger: Function
  cvNode: ConstantSourceNode
  connected: boolean = false

  constructor(context: AudioContext) {
    this.context = context
    this.createCvNode()
  }

  private createCvNode(): void {
    this.cvNode = createConstantSourceNode(this.context, 0)
  }

 public connect(trigger: Function): void {
    this.trigger = trigger
    if (!this.connected) {
      this.addEventListeners()
      this.connected = true
    }
  }

  public disconnect(): void {
    this.trigger = null
    if (this.connected) {
      this.removeEventListeners()
      this.connected = true
    }
  }

  private addEventListeners = (): void => {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  }

  private removeEventListeners = (): void => {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const note = getNote(event.code)
    if (note > 0) {
      this.cvNode.offset.setValueAtTime(note, this.context.currentTime)
      this.trigger && this.trigger(1)
    }
  }

  private onKeyUp = (event: KeyboardEvent): void => {
    this.trigger && this.trigger(0)
  }

  noteOutput(): ConstantSourceNode {
    return this.cvNode
  }
}