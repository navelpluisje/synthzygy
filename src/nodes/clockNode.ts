import { createGainNode } from '@utilities/createGain';
import { GateTrigger } from 'src/types';

export class ClockNode {
  private frequency: number = 10;
  private pulseWidth: number = 0.5;
  private trigger: Record<number, GateTrigger> = {};
  private node: AudioWorkletNode;
  private context: AudioContext;
  private output: GainNode;

  constructor(context: AudioContext) {
    this.context = context;

    this.output = createGainNode(this.context, 0);

    this.node = new AudioWorkletNode(this.context, 'clock-processor');
    this.node.port.onmessage = this.handleMessage;

    this.node.connect(this.output);
    this.output.connect(this.context.destination);

    this.setFrequency(this.frequency);
    this.setPulseWidth(this.pulseWidth);
  }

  public setFrequency = (frequency: number) => {
    this.frequency = frequency;
    this.node.parameters.get('frequency').setTargetAtTime(frequency, this.context.currentTime, 0.001);
  }

  public setPulseWidth = (pulseWidth: number) => {
    this.pulseWidth = pulseWidth;
    this.node.parameters.get('pulseWidth').setTargetAtTime(pulseWidth, this.context.currentTime, 0.001);
  }

  public connect(trigger: GateTrigger, id: number): void {
    this.trigger[id] = trigger;
  }

  public disconnect(id: number) {
    this.trigger[id] = null;
    delete this.trigger[id];
  }

  public onKeyDown = () => {
    this.trigger && (
      Object.values(this.trigger).forEach((trigger) => trigger(1))
    );
  }

  public onKeyUp = () => {
    this.trigger && (
      Object.values(this.trigger).forEach((trigger) => trigger(0))
    );
  }

  private handleMessage = (event: MessageEvent) => {
    this.trigger && (
      Object.values(this.trigger).forEach((trigger) => trigger(event.data.value))
    );
  }
}
