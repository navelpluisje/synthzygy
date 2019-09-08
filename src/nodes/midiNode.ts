import { notes } from 'src/midinotes'

const NOTE_OFF = '8'
const NOTE_ON = '9'
const MODULATION = 'b'
const AFTERTOUCH = 'd'
const PITCHBEND = 'e'
// const NOTE_OFF = '8';
const PROGRAM_CHANGE = 'c';

export class MidiNode {
  context: AudioContext
  trigger: Record<number, Function> = {}
  cvNoteNode: AudioWorkletNode
  connected: boolean = false
  activeNote: number
  port: string
  midiInputs: WebMidi.MIDIInput[]
  midiOutputs: WebMidi.MIDIOutput[]
  midiInput: WebMidi.MIDIInput
  midiOutput: WebMidi.MIDIOutput

  constructor(context: AudioContext) {
    this.context = context
    this.port = null
    this.createCvNodes()
    this.getAccess()
  }

  createCvNodes() {
    this.cvNoteNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvNoteNode.parameters.get('value').setValueAtTime(2, this.context.currentTime)
  }

  onConnectionChange = (connectionEvent: WebMidi.MIDIConnectionEvent) => {
    const midiAccess = <WebMidi.MIDIAccess>connectionEvent.target
    this.onMIDISuccess(midiAccess)
  }

  async getAccess() {
    const midiAccess = await navigator.requestMIDIAccess();
    if (midiAccess.inputs) {
      this.onMIDISuccess(midiAccess)
    } else {
      console.warn('Whaaaaat, no MIDI inputs available')
    }
    midiAccess.onstatechange = this.onConnectionChange
  }

  onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
    this.midiInputs = Array
      .from(midiAccess.inputs)
      .map(input => input[1]);
    this.midiOutputs = Array
      .from(midiAccess.outputs)
      .map(output => output[1]);

    this.setMidiDevice('-1883882508')

  }

  setMidiDevice(id: string) {
    const input = this.midiInputs.filter(inp => inp.id === id);
    const output = this.midiOutputs.filter(outp => outp.id === id);
    if (input.length > 0) {
      [this.midiInput] = input;
    }
    this.midiInput.onmidimessage = this.handleMidiMessage;
    if (output.length > 0) {
      [this.midiOutput] = output;
    }
  }

  setMidiPort(port: number) {
    if (port === 0) {
      this.port = null;
    } else {
      this.port = (port - 1).toString(16);
    }
  }

  static substractCommand(command: number) {
    const [cmd, port] = command.toString(16);
    return {
      cmd,
      port,
    };
  }

  private setNote(midiNote: number) {
    // @ts-ignore
    const note = notes[midiNote].value
    this.cvNoteNode.parameters.get('value').setValueAtTime(note, this.context.currentTime)
  }

  private handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [cmd, key, value] = message.data;
    const command = MidiNode.substractCommand(cmd);

    if (this.port !== null && command.port !== this.port) {
      return false;
    }

    switch (command.cmd) {
      case NOTE_OFF:
        this.trigger && key === this.activeNote && (
          Object.values(this.trigger).forEach(trigger => trigger(0))
        )
      break;

      case NOTE_ON:
        this.activeNote = key
        this.setNote(key)
        this.trigger && (
          Object.values(this.trigger).forEach(trigger => trigger(1))
        )
        break;

      case MODULATION:
        break;

      case AFTERTOUCH:
        break;

      case PITCHBEND:
        break;

      case PROGRAM_CHANGE:
        break;

      default:
    }
  }

  public connect(trigger: Function, id: number): void {
    this.trigger[id] = trigger
  }

  public disconnect(id: number) {
    this.trigger[id] = null
    delete this.trigger[id]
  }

  public noteOutput(): AudioWorkletNode {
    return this.cvNoteNode
  }
}