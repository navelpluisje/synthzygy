export interface MidiNote {
  freq: number;
  note: string;
  value: number;
}

export const notes: Record<number, MidiNote> = {
  12: {
    freq: 16.35,
    note: 'C0',
    value: 0,
  },
  13: {
    freq: 17.32,
    note: 'C#0',
    value: 0.05946,
  },
  14: {
    freq: 18.35,
    note: 'D0',
    value: 0.12247,
  },
  15: {
    freq: 19.45,
    note: 'D#0',
    value: 0.18921,
  },
  16: {
    freq: 20.60,
    note: 'E0',
    value: 0.25992,
  },
  17: {
    freq: 21.83,
    note: 'F0',
    value: 0.33484,
  },
  18: {
    freq: 23.12,
    note: 'F#0',
    value: 0.41422,
  },
  19: {
    freq: 24.50,
    note: 'G0',
    value: 0.49831,
  },
  20: {
    freq: 25.96,
    note: 'G#0',
    value: 0.58741,
  },
  21: {
    freq: 27.50,
    note: 'A0',
    value: 0.68180,
  },
  22: {
    freq: 29.14,
    note: 'A#0',
    value: 0.78181,
  },
  23: {
    freq: 30.87,
    note: 'B0',
    value: 0.88775,
  },
  24: {
    freq: 32.70,
    note: 'C1',
    value: 1,
  },
  25: {
    freq: 34.65,
    note: 'C#1',
    value: 1.05946,
  },
  26: {
    freq: 36.71,
    note: 'D1',
    value: 1.12247,
  },
  27: {
    freq: 38.89,
    note: 'D#1',
    value: 1.18921,
  },
  28: {
    freq: 41.20,
    note: 'E1',
    value: 1.25992,
  },
  29: {
    freq: 43.65,
    note: 'F1',
    value: 1.33484,
  },
  30: {
    freq: 46.25,
    note: 'F#1',
    value: 1.41422,
  },
  31: {
    freq: 49.00,
    note: 'G1',
    value: 1.49831,
  },
  32: {
    freq: 51.91,
    note: 'G#1',
    value: 1.58741,
  },
  33: {
    freq: 55.00,
    note: 'A1',
    value: 1.68180,
  },
  34: {
    freq: 58.27,
    note: 'A#1',
    value: 1.78181,
  },
  35: {
    freq: 61.74,
    note: 'B1',
    value: 1.88775,
  },
  36: {
    freq: 65.41,
    note: 'C2',
    value: 2,
  },
  37: {
    freq: 69.30,
    note: 'C#2',
    value: 2.05946,
  },
  38: {
    freq: 73.42,
    note: 'D2',
    value: 2.12247,
  },
  39: {
    freq: 77.78,
    note: 'D#2',
    value: 2.18921,
  },
  40: {
    freq: 82.41,
    note: 'E2',
    value: 2.25992,
  },
  41: {
    freq: 87.31,
    note: 'F2',
    value: 2.33484,
  },
  42: {
    freq: 92.50,
    note: 'F#2',
    value: 2.41422,
  },
  43: {
    freq: 98.00,
    note: 'G2',
    value: 2.49831,
  },
  44: {
    freq: 103.83,
    note: 'G#2',
    value: 2.58741,
  },
  45: {
    freq: 110.00,
    note: 'A2',
    value: 2.68180,
  },
  46: {
    freq: 116.54,
    note: 'A#2',
    value: 2.78181,
  },
  47: {
    freq: 123.47,
    note: 'B2',
    value: 2.88775,
  },
  48: {
    freq: 130.81,
    note: 'C3',
    value: 3,
  },
  49: {
    freq: 138.59,
    note: 'C#3',
    value: 3.05946,
  },
  50: {
    freq: 146.83,
    note: 'D3',
    value: 3.12247,
  },
  51: {
    freq: 155.56,
    note: 'D#3',
    value: 3.18921,
  },
  52: {
    freq: 164.81,
    note: 'E3',
    value: 3.25992,
  },
  53: {
    freq: 174.61,
    note: 'F3',
    value: 3.33484,
  },
  54: {
    freq: 185.00,
    note: 'F#3',
    value: 3.41422,
  },
  55: {
    freq: 196.00,
    note: 'G3',
    value: 3.49831,
  },
  56: {
    freq: 207.65,
    note: 'G#3',
    value: 3.58741,
  },
  57: {
    freq: 220.00,
    note: 'A3',
    value: 3.68180,
  },
  58: {
    freq: 233.08,
    note: 'A#3',
    value: 3.78181,
  },
  59: {
    freq: 246.94,
    note: 'B3',
    value: 3.88775,
  },
  60: {
    freq: 261.63,
    note: 'C4',
    value: 4,
  },
  61: {
    freq: 277.18,
    note: 'C#4',
    value: 4.05946,
  },
  62: {
    freq: 293.66,
    note: 'D4',
    value: 4.12247,
  },
  63: {
    freq: 311.13,
    note: 'D#4',
    value: 4.18921,
  },
  64: {
    freq: 329.63,
    note: 'E4',
    value: 4.25992,
  },
  65: {
    freq: 349.23,
    note: 'F4',
    value: 4.33484,
  },
  66: {
    freq: 369.99,
    note: 'F#4',
    value: 4.41422,
  },
  67: {
    freq: 392.00,
    note: 'G4',
    value: 4.49831,
  },
  68: {
    freq: 415.30,
    note: 'G#4',
    value: 4.58741,
  },
  69: {
    freq: 440.00,
    note: 'A4',
    value: 4.68180,
  },
  70: {
    freq: 466.16,
    note: 'A#4',
    value: 4.78181,
  },
  71: {
    freq: 493.88,
    note: 'B4',
    value: 4.88775,
  },
  72: {
    freq: 523.25,
    note: 'C5',
    value: 5,
  },
  73: {
    freq: 554.37,
    note: 'C#5',
    value: 5.05946,
  },
  74: {
    freq: 587.33,
    note: 'D5',
    value: 5.12247,
  },
  75: {
    freq: 622.25,
    note: 'D#5',
    value: 5.18921,
  },
  76: {
    freq: 659.25,
    note: 'E5',
    value: 5.25992,
  },
  77: {
    freq: 698.46,
    note: 'F5',
    value: 5.33484,
  },
  78: {
    freq: 739.99,
    note: 'F#5',
    value: 5.41422,
  },
  79: {
    freq: 783.99,
    note: 'G5',
    value: 5.49831,
  },
  80: {
    freq: 830.61,
    note: 'G#5',
    value: 5.58741,
  },
  81: {
    freq: 880.00,
    note: 'A5',
    value: 5.68180,
  },
  82: {
    freq: 932.33,
    note: 'A#5',
    value: 5.78181,
  },
  83: {
    freq: 987.77,
    note: 'B5',
    value: 5.88775,
  },
  84: {
    freq: 1046.50,
    note: 'C6',
    value: 6,
  },
  85: {
    freq: 1108.73,
    note: 'C#6',
    value: 6.05946,
  },
  86: {
    freq: 1174.66,
    note: 'D6',
    value: 6.12247,
  },
  87: {
    freq: 1244.51,
    note: 'D#6',
    value: 6.18921,
  },
  88: {
    freq: 1318.51,
    note: 'E6',
    value: 6.25992,
  },
  89: {
    freq: 1396.91,
    note: 'F6',
    value: 6.33484,
  },
  90: {
    freq: 1479.98,
    note: 'F#6',
    value: 6.41422,
  },
  91: {
    freq: 1567.98,
    note: 'G6',
    value: 6.49831,
  },
  92: {
    freq: 1661.22,
    note: 'G#6',
    value: 6.58741,
  },
  93: {
    freq: 1760.00,
    note: 'A6',
    value: 6.68180,
  },
  94: {
    freq: 1864.66,
    note: 'A#6',
    value: 6.78181,
  },
  95: {
    freq: 1975.53,
    note: 'B6',
    value: 6.88775,
  },
  96: {
    freq: 2093.00,
    note: 'C7',
    value: 7,
  },
  97: {
    freq: 2217.46,
    note: 'C#7',
    value: 7.05946,
  },
  98: {
    freq: 2349.32,
    note: 'D7',
    value: 7.12247,
  },
  99: {
    freq: 2489.02,
    note: 'D#7',
    value: 7.18921,
  },
  100: {
    freq: 2637.02,
    note: 'E7',
    value: 7.25992,
  },
  101: {
    freq: 2793.83,
    note: 'F7',
    value: 7.33484,
  },
  102: {
    freq: 2959.96,
    note: 'F#7',
    value: 7.41422,
  },
  103: {
    freq: 3135.96,
    note: 'G7',
    value: 7.49831,
  },
  104: {
    freq: 3322.44,
    note: 'G#7',
    value: 7.58741,
  },
  105: {
    freq: 3520.00,
    note: 'A7',
    value: 7.68180,
  },
  106: {
    freq: 3729.31,
    note: 'A#7',
    value: 7.78181,
  },
  107: {
    freq: 3951.07,
    note: 'B7',
    value: 7.88775,
  },
  108: {
    freq: 4186.01,
    note: 'C8',
    value: 8,
  },
  109: {
    freq: 4434.92,
    note: 'C#8',
    value: 8.05946,
  },
  110: {
    freq: 4698.63,
    note: 'D8',
    value: 8.12247,
  },
  111: {
    freq: 4978.03,
    note: 'D#8',
    value: 8.18921,
  },
  112: {
    freq: 5274.04,
    note: 'E8',
    value: 8.25992,
  },
  113: {
    freq: 5587.65,
    note: 'F8',
    value: 8.33484,
  },
  114: {
    freq: 5919.91,
    note: 'F#8',
    value: 8.41422,
  },
  115: {
    freq: 6271.93,
    note: 'G8',
    value: 8.49831,
  },
  116: {
    freq: 6644.88,
    note: 'G#8',
    value: 8.58741,
  },
  117: {
    freq: 7040.00,
    note: 'A8',
    value: 8.68180,
  },
  118: {
    freq: 7458.62,
    note: 'A#8',
    value: 8.78181,
  },
  119: {
    freq: 7902.13,
    note: 'B8',
    value: 8.88775,
  },
};
