import { notes } from 'src/midinotes'

const NOTE_OFF = '8'
const NOTE_ON = '9'
const CONTROL_CHANGE = 'b'
const AFTERTOUCH = 'd'
const PITCHBEND = 'e'
// const NOTE_OFF = '8'
const MODULATION = 1
const PROGRAM_CHANGE = 'c'

const TIMING_CLOCK = '248'
const CONTROL_START = '250'
const CONTROL_CONTINUE = '251'
const CONTROL_STOP = '252'

export class MidiNode {
  private context: AudioContext
  private trigger: Record<number, Function> = {}
  private startTrigger: Record<number, Function> = {}
  private stopTrigger: Record<number, Function> = {}
  private clockTrigger: Record<number, Function> = {}
  private cvNoteNode: AudioWorkletNode
  private cvPitchNode: AudioWorkletNode
  private cvModulationNode: AudioWorkletNode
  private cvAfterTouchNode: AudioWorkletNode
  private connected: boolean = false
  private activeNote: number
  private port: string
  private noteLength: number = 8
  private noteStep: number = 0
  private clockOn: boolean = false
  private midiInputs: WebMidi.MIDIInput[]
  private midiOutputs: WebMidi.MIDIOutput[]
  private midiInput: WebMidi.MIDIInput
  private midiOutput: WebMidi.MIDIOutput

  constructor(context: AudioContext) {
    this.context = context
    this.port = null
    this.createCvNodes()
    this.getAccess()
  }

  private createCvNodes() {
    this.cvNoteNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvNoteNode.parameters.get('value').setValueAtTime(2, this.context.currentTime)
    this.cvPitchNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvPitchNode.parameters.get('value').setValueAtTime(2, this.context.currentTime)
    this.cvModulationNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvModulationNode.parameters.get('value').setValueAtTime(2, this.context.currentTime)
    this.cvAfterTouchNode = new AudioWorkletNode(this.context, 'cv-output-processor')
    this.cvAfterTouchNode.parameters.get('value').setValueAtTime(2, this.context.currentTime)
  }

  private onConnectionChange = (connectionEvent: WebMidi.MIDIConnectionEvent) => {
    const midiAccess = <WebMidi.MIDIAccess>connectionEvent.target
    this.onMIDISuccess(midiAccess)
  }

  async getAccess() {
    const midiAccess = await navigator.requestMIDIAccess()
    if (midiAccess.inputs) {
      this.onMIDISuccess(midiAccess)
    } else {
      console.warn('Whaaaaat, no MIDI inputs available')
    }
    midiAccess.onstatechange = this.onConnectionChange
  }

  private onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
    this.midiInputs = Array
      .from(midiAccess.inputs)
      .map(input => input[1])
    this.midiOutputs = Array
      .from(midiAccess.outputs)
      .map(output => output[1])
  }

  public setMidiDevice = (id: string) => {
    const input = this.midiInputs.filter(inp => inp.id === id)
    const output = this.midiOutputs.filter(outp => outp.id === id)
    if (input.length > 0) {
      [this.midiInput] = input
      this.midiInput.onmidimessage = this.handleMidiMessage
    }
    if (output.length > 0) {
      [this.midiOutput] = output
    }
  }

  public getMidiInputs() {
    return this.midiInputs.map(input => ([
      input.id,
      input.name,
    ]))
  }

  public getActiveInput(): string {
    return this.midiInput && this.midiInput.id || '666'
  }

  public setMidiPort(port: number) {
    if (port === 0) {
      this.port = null
    } else {
      this.port = (port - 1).toString(16)
    }
  }

  public setClockStepSize = (size: number): void => {
    this.noteLength = 2 ** size
  }

  static substractCommand(command: number) {
    const [cmd, port] = command.toString(16)
    return {
      cmd,
      port,
    }
  }

  private getValue(min: number, max: number, midiValue: number): number {
    const range = max - min;
    return ((range / 128) * midiValue) + min
  }

  private setNote(midiNote: number) {
    // @ts-ignore
    const note = notes[midiNote].value
    this.cvNoteNode.parameters.get('value').setValueAtTime(note, this.context.currentTime)
  }

  private setPitch(midiValue: number) {
    const value = this.getValue(-2.5, 2.5, midiValue)
    this.cvPitchNode.parameters.get('value').setValueAtTime(value, this.context.currentTime)
  }

  private setModulation(midiValue: number) {
    const value = this.getValue(0, 8, midiValue)
    this.cvModulationNode.parameters.get('value').setValueAtTime(value, this.context.currentTime)
  }

  private setAfterTouch(midiValue: number) {
    const value = this.getValue(0, 8, midiValue)
    this.cvAfterTouchNode.parameters.get('value').setValueAtTime(value, this.context.currentTime)
  }

  private handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    const [cmd, key, value] = message.data
    let command = {
      cmd: cmd.toString(),
      port: '0',
    }

    if (key && value) {
      command = MidiNode.substractCommand(cmd)
    }

    // console.l  og({cmd, key, value})
    if (this.port !== null && command.port !== this.port) {
      return false
    }

    switch (command.cmd) {
      case NOTE_OFF:
        this.handleNoteOff(key)
        break

      case NOTE_ON:
        this.handleNoteOn(key)
        break

      case CONTROL_CHANGE:
        if (key === MODULATION) {
          this.setModulation(value)
        }
        break

      case AFTERTOUCH:
        this.setAfterTouch(key)
        break

      case PITCHBEND:
        this.setPitch(value)
        break

      case TIMING_CLOCK:
        this.handleTimingClock()
        break
    }
  }

  private handleTimingClock() {
    if (this.noteStep === this.noteLength - 1) {
      this.noteStep = -1
      this.clockOn = true
      this.clockTrigger && (
        Object.values(this.clockTrigger).forEach(trigger => trigger(1))
        )
      }
      this.noteStep += 1
      if (this.clockOn && this.noteStep * 2 >= this.noteLength) {
        this.clockOn = false
        this.clockTrigger && (
        Object.values(this.clockTrigger).forEach(trigger => trigger(1))
      )
    }
  }

  private handleNoteOn(key: number) {
    this.activeNote = key
    this.setNote(key)
    this.trigger && (
      Object.values(this.trigger).forEach(trigger => trigger(1))
    )
  }

  private handleNoteOff(key: number) {
    this.trigger && key === this.activeNote && (
      Object.values(this.trigger).forEach(trigger => trigger(0))
    )
  }

  public clockNode() {
    return ({
      connect: (trigger: Function, id: number) => {
        this.clockTrigger[id] = trigger
      },
    })
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
  public pitchOutput(): AudioWorkletNode {
    return this.cvPitchNode
  }
  public modulationOutput(): AudioWorkletNode {
    return this.cvModulationNode
  }
  public aftertouchOutput(): AudioWorkletNode {
    return this.cvAfterTouchNode
  }
}