export class GateNode {
  trigger: Function

  connect(trigger: Function) {
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