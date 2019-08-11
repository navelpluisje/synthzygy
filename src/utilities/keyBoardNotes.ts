type Octave = {
  [key: string]: number,
}
const OCTAVE: Octave = {
  'KeyZ': 261.63,
  'KeyS': 277.18,
  'KeyX': 293.66,
  'KeyD': 311.13,
  'KeyC': 329.63,
  'KeyV': 349.23,
  'KeyG': 369.99,
  'KeyB': 392.00,
  'KeyH': 415.30,
  'KeyN': 440.00,
  'KeyJ': 466.16,
  'KeyM': 493.88,
}

export const getNote = (key: string): number => {
  return OCTAVE[key] || 0
}