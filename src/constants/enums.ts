export enum Colors {
  TransBlack = 'hsla(0, 0%, 0%, 0.6)',
  TransWhite = 'hsla(0, 0%, 100%, 0.02)',
  ModuleBackground = '#212121',
  ModuleTitle = '#d9e5d6',
  ControlLabel = '#d9e5d6',
  ControlRing = '#93827f',
  ControlBorder = '#d9e5d6',
  ControlMarker = '#d9e5d6',
  ControlBackground = '#454845',
  AccentGenerator = '#c04d35',
  AccentAudioPath = '#e2712e',
  AccentEffect = '#dbb04a',
  AccentModulator = '#68a678',
  AccentUtility = '#577590',
  Connection = '#8c1c13',
}

export enum Transport {
  Stop = 0,
  Start = 1,
  Continue = 2,
}

export enum NoiseTypes {
  White = 'white',
  Pink = 'pink',
  Blue = 'blue',
}

/**
 * More info on midi messages con be found:
 * https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message
 */
export enum MidiEvents {
  NoteOff = '8',
  NoteOn = '9',
  ControlChange = 'b',
  ChannelPressure = 'd',
  PitchBend = 'e',
  SystemMessages = 'f',
}

export enum MidiSystemMessages {
  TimingClock = '8',
  Start = 'a',
  Continue = 'b',
  Stop = 'c',
}

export enum ControlChanges {
  Modulation = 1,
}
