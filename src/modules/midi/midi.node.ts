import { GateNode } from '@nodes/gateNode';
import { createConstantSourceNode } from '@utilities/createConstantSource';
import { Transport } from 'src/constants/enums';
import { notes } from 'src/midinotes';
import { GateTrigger } from 'src/types';

const NOTE_OFF = '8';
const NOTE_ON = '9';
const CONTROL_CHANGE = 'b';
const AFTERTOUCH = 'd';
const PITCHBEND = 'e';
// const NOTE_OFF = '8'
const MODULATION = 1;

const TIMING_CLOCK = '248';
const CONTROL_START = '250';
const CONTROL_CONTINUE = '251';
const CONTROL_STOP = '252';

export class MidiNode {

  public static substractCommand(command: number) {
    const [cmd, port] = command.toString(16);
    return {
      cmd,
      port,
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

  public getMidiInputs() {
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

  public setClockStepSize = (size: number): void => {
    this.noteLength = 2 ** size;
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
    // @ts-ignore
    const note = notes[midiNote].value;
    this.cvNoteNode.offset.setValueAtTime(note, this.context.currentTime);
  }

  private setPitch(midiValue: number) {
    const value = this.getValue(-2.5, 2.5, midiValue);
    this.cvPitchNode.offset.setValueAtTime(value, this.context.currentTime);
  }

  private setModulation(midiValue: number) {
    const value = this.getValue(0, 8, midiValue);
    this.cvModulationNode.offset.setValueAtTime(value, this.context.currentTime);
  }

  private setAfterTouch(midiValue: number) {
    const value = this.getValue(0, 8, midiValue);
    this.cvAfterTouchNode.offset.setValueAtTime(value, this.context.currentTime);
  }

  private handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [cmd, key, value] = message.data;
    let command = {
      cmd: cmd.toString(),
      port: '0',
    };

    if (key && value) {
      command = MidiNode.substractCommand(cmd);
    }

    // console.l  og({cmd, key, value})
    if (this.port !== null && command.port !== this.port) {
      return false;
    }

    switch (command.cmd) {
      case NOTE_OFF:
        this.handleNoteOff(key);
        break;

      case NOTE_ON:
        this.handleNoteOn(key);
        break;

      case CONTROL_CHANGE:
        if (key === MODULATION) {
          this.setModulation(value);
        }
        break;

      case AFTERTOUCH:
        this.setAfterTouch(key);
        break;

      case PITCHBEND:
        this.setPitch(value);
        break;

      case TIMING_CLOCK:
        this.handleTimingClock();
        break;

      case CONTROL_START:
        this.handleTransport(Transport.Start);
        break;

      case CONTROL_CONTINUE:
        this.handleTransport(Transport.Continue);
        break;

      case CONTROL_STOP:
        this.handleTransport(Transport.Stop);
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
