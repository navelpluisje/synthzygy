interface Octave {
  [key: string]: number;
}
const OCTAVE: Octave = {
  KeyB: 392.00,
  KeyC: 329.63,
  KeyD: 311.13,
  KeyG: 369.99,
  KeyH: 415.30,
  KeyJ: 466.16,
  KeyM: 493.88,
  KeyN: 440.00,
  KeyS: 277.18,
  KeyV: 349.23,
  KeyX: 293.66,
  KeyZ: 261.63,
};

export const getNote = (key: string): number => {
  return OCTAVE[key] || 0;
};
