import { createConstantSourceNode } from '@utilities/createConstantSource';
import { getNote } from '@utilities/keyBoardNotes';
import { GateTrigger } from 'src/types';

export class KeyboardNode {
  public context: AudioContext;
  public trigger: GateTrigger;
  public cvNode: ConstantSourceNode;
  public connected: boolean = false;

  constructor(context: AudioContext) {
    this.context = context;
    this.createCvNode();
  }

 public connect(trigger: GateTrigger): void {
    this.trigger = trigger;
    if (!this.connected) {
      this.addEventListeners();
      this.connected = true;
    }
  }

  public disconnect(): void {
    this.trigger = null;
    if (this.connected) {
      this.removeEventListeners();
      this.connected = true;
    }
  }

  public noteOutput(): ConstantSourceNode {
    return this.cvNode;
  }

  private createCvNode(): void {
    this.cvNode = createConstantSourceNode(this.context, 0);
  }

  private addEventListeners = (): void => {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  private removeEventListeners = (): void => {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const note = getNote(event.code);
    if (note > 0) {
      this.cvNode.offset.setTargetAtTime(note, this.context.currentTime, 0.001);
      this.trigger && this.trigger(1);
    }
  }

  private onKeyUp = (event: KeyboardEvent): void => {
    this.trigger && this.trigger(0);
  }
}
