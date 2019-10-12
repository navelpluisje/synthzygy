import { GateTrigger } from 'src/types';

export class GateNode implements GateNode {
  private triggers: Record<number, GateTrigger> = {};

  public connect(trigger: GateTrigger, id: number): void {
    this.triggers[id] = trigger;
  }

  public disconnect(id: number) {
    this.triggers[id] = null;
    delete this.triggers[id];
  }

  public onKeyDown = () => {
    this.triggers && (
      Object.values(this.triggers).forEach((trigger) => trigger(1))
    );
  }

  public onKeyUp = () => {
    this.triggers && (
      Object.values(this.triggers).forEach((trigger) => trigger(0))
    );
  }

  public trigger = (value: number) => {
    this.triggers && (
      Object.values(this.triggers).forEach((trigger) => trigger(value))
    );
  }
}
