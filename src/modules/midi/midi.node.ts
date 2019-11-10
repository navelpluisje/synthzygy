import { GateNode } from '@nodes/gateNode';
import { createConstantSourceNode } from '@utilities/createConstantSource';
import {
  ControlChanges,
  MidiEvents,
  MidiSystemMessages,
  Transport,
 } from 'src/constants/enums';
import { notes } from 'src/midinotes';
import { GateTrigger } from 'src/types';

export class MidiNode {

  public static substractCommand(command: number) {
    const [event, message] = command.toString(16);
    return {
      event,
      message,
    };
  }
  private context: AudioContext;
  private trigger: Record<number, GateTrigger> = {};
  private transportTriggerNode: GateNode;
  private clockTriggerNode: GateNode;
  private cvNoteNode: ConstantSourceNode;
  private cvPitchNode: ConstantSourceNode;
  private cvModulationNode: ConstantSourceNode;
  private cvAfterTouchNode: ConstantSourceNode;
  private activeNote: number;
  private port: string;
  private noteLength: number = 8;
  private noteStep: number = 0;
  private clockOn: boolean = false;
  private midiInputs: WebMidi.MIDIInput[];
  private midiInput: WebMidi.MIDIInput;

  constructor(context: AudioContext) {
    this.context = context;
    this.port = null;
    this.transportTriggerNode = new GateNode();
    this.clockTriggerNode = new GateNode();
    this.createCvNodes();
    this.getAccess();
  }

  public async getAccess() {
    const midiAccess = await navigator.requestMIDIAccess();
    if (midiAccess.inputs) {
      this.onMIDISuccess(midiAccess);
    } else {
      console.warn('Whaaaaat, no MIDI inputs available');
    }
    midiAccess.onstatechange = this.onConnectionChange;
  }

  public setMidiDevice = (id: string) => {
    const input = this.midiInputs.filter((inp) => inp.id === id);
    if (input.length > 0) {
      [this.midiInput] = input;
      this.midiInput.onmidimessage = this.handleMidiMessage;
    }
  }

  public getMidiInputs(): Array<[string, string]> {
    return this.midiInputs.map((input) => ([
      input.id,
      input.name,
    ]));
  }

  public getActiveInput(): string {
    return this.midiInput && this.midiInput.id || '666';
  }

  public setMidiPort(port: number) {
    if (port === 0) {
      this.port = null;
    } else {
      this.port = (port - 1).toString(16);
    }
  }

  public getMidiPort(): number {
    return parseInt(this.port, 16);
  }

  public setClockStepSize = (size: number): void => {
    this.noteLength = 2 ** size;
  }

  public getClockStepSize(): number {
    return Math.log(this.noteLength) / Math.log(2);
  }

  public clockNode(): GateNode {
    return this.clockTriggerNode;
  }

  public transportNode(): GateNode {
    return this.transportTriggerNode;
  }

  public connect(trigger: GateTrigger, id: number): void {
    this.trigger[id] = trigger;
  }

  public disconnect(id: number) {
    this.trigger[id] = null;
    delete this.trigger[id];
  }

  public noteOutput(): ConstantSourceNode {
    return this.cvNoteNode;
  }
  public pitchOutput(): ConstantSourceNode {
    return this.cvPitchNode;
  }
  public modulationOutput(): ConstantSourceNode {
    return this.cvModulationNode;
  }
  public aftertouchOutput(): ConstantSourceNode {
    return this.cvAfterTouchNode;
  }

  private createCvNodes() {
    this.cvNoteNode = createConstantSourceNode(this.context, 2);
    this.cvPitchNode = createConstantSourceNode(this.context, 2);
    this.cvModulationNode = createConstantSourceNode(this.context, 2);
    this.cvAfterTouchNode = createConstantSourceNode(this.context, 2);
  }

  private onConnectionChange = (connectionEvent: WebMidi.MIDIConnectionEvent) => {
    const midiAccess = connectionEvent.target as WebMidi.MIDIAccess;
    this.onMIDISuccess(midiAccess);
  }

  private onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
    this.midiInputs = Array
      .from(midiAccess.inputs)
      .map((input) => input[1]);
  }

  private getValue(min: number, max: number, midiValue: number): number {
    const range = max - min;
    return ((range / 128) * midiValue) + min;
  }

  private setNote(midiNote: number) {
    const note = notes[midiNote].value;
    this.cvNoteNode.offset.setTargetAtTime(note, this.context.currentTime, 0.001);
  }

  private setPitch(midiValue: number) {
    const value = this.getValue(-2.5, 2.5, midiValue);
    this.cvPitchNode.offset.setTargetAtTime(value, this.context.currentTime, 0.001);
  }

  private setModulation(midiValue: number) {
    const value = this.getValue(0, 8, midiValue);
    this.cvModulationNode.offset.setTargetAtTime(value, this.context.currentTime, 0.001);
  }

  private setAfterTouch(midiValue: number) {
    const value = this.getValue(0, 8, midiValue);
    this.cvAfterTouchNode.offset.setTargetAtTime(value, this.context.currentTime, 0.001);
  }

  private handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [cmd, key, value] = message.data;
    const command = MidiNode.substractCommand(cmd);

    if (this.port !== null && command.message !== this.port) {
      return false;
    }

    switch (command.event) {
      case MidiEvents.NoteOff:
        this.handleNoteOff(key);
        break;

      case MidiEvents.NoteOn:
        this.handleNoteOn(key);
        break;

      case MidiEvents.ControlChange:
        if (key === ControlChanges.Modulation) {
          this.setModulation(value);
        }
        break;

      case MidiEvents.ChannelPressure:
        this.setAfterTouch(key);
        break;

      case MidiEvents.PitchBend:
        this.setPitch(value);
        break;

      case MidiEvents.SystemMessages:
        switch (command.message) {
          case MidiSystemMessages.TimingClock:
            this.handleTimingClock();
            break;

          case MidiSystemMessages.Start:
            this.handleTransport(Transport.Start);
            break;

          case MidiSystemMessages.Continue:
            this.handleTransport(Transport.Continue);
            break;

          case MidiSystemMessages.Stop:
            this.handleTransport(Transport.Stop);
            break;
        }
        break;
    }
  }

  private handleTimingClock() {
    if (this.noteStep === this.noteLength - 1) {
      this.noteStep = -1;
      this.clockOn = true;
      this.clockTriggerNode && this.clockTriggerNode.trigger(1);
    }
    this.noteStep += 1;
    if (this.clockOn && this.noteStep * 2 >= this.noteLength) {
      this.clockOn = false;
      this.clockTriggerNode && this.clockTriggerNode.trigger(1);
    }
  }

  private handleTransport(mode: Transport): void {
    this.transportTriggerNode && this.transportTriggerNode.trigger(mode);
  }

  private handleNoteOn(key: number) {
    this.activeNote = key;
    this.setNote(key);
    this.trigger && (
      Object.values(this.trigger).forEach((trigger) => trigger(1))
    );
  }

  private handleNoteOff(key: number) {
    this.trigger && key === this.activeNote && (
      Object.values(this.trigger).forEach((trigger) => trigger(0))
    );
  }
}
