export interface GateNode {
  connect(trigger: Function): void
  disconnect(): void
  onKeyDown(): void
  onKeyUp(): void
}

export class GateNode implements GateNode{
  trigger: Function

  connect(trigger: Function): void {
    this.trigger = trigger
  }

  disconnect() {
    this.trigger = null
  }

  onKeyDown = () => {
    this.trigger && this.trigger(1)
  }

  onKeyUp = () => {
    this.trigger && this.trigger(0)
  }
}