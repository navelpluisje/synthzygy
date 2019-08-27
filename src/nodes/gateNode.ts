export interface GateNode {
  connect(trigger: Function, id: number): void
  disconnect(id: number): void
  onKeyDown(): void
  onKeyUp(): void
}

export class GateNode implements GateNode{
  trigger: Record<number, Function> = {}

  connect(trigger: Function, id: number): void {
    this.trigger[id] = trigger
  }

  disconnect(id: number) {
    this.trigger[id] = null
    delete this.trigger[id]
  }

  onKeyDown = () => {
    this.trigger && (
      Object.values(this.trigger).forEach(trigger => trigger(1))
    )
  }

  onKeyUp = () => {
    this.trigger && (
      Object.values(this.trigger).forEach(trigger => trigger(0))
    )
  }
}