import { createGainNode } from '@utilities/createGain';
import { createOscillatorNode } from '@utilities/createOscillator';

export class HarmonicNode {
  private frequency: number;
  private detune: number;
  private fm: number;
  private real: Float32Array;
  private imag: Float32Array;
  private context: AudioContext;
  private wave: PeriodicWave;
  private oscillator: OscillatorNode;
  private boost: GainNode;
  private cvFmNode: GainNode;

  constructor(
    context: AudioContext,
    frequency: number = 3,
    detune: number = 0,
    fm: number = 0,
  ) {
    this.context = context;
    this.frequency = frequency;
    this.detune = detune;
    this.fm = fm;
    this.createGainNodes();
    this.createOscillator();
    this.connectNodes();
    this.setDefaultValues();
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = this.calculateFrequency(frequency);
    this.oscillator.frequency.setTargetAtTime(this.frequency, this.context.currentTime, 0.001);
  }

  public getFrequency(): number {
    return this.frequency;
  }

  public setDetune = (detune: number): void => {
    this.detune = detune;
    this.oscillator.detune.setTargetAtTime(this.detune, this.context.currentTime, 0.001);
  }

  public getDetune(): number {
    return this.detune;
  }

  public setFm = (fm: number): void => {
    this.fm = fm;
    this.cvFmNode.gain.setTargetAtTime(this.fm, this.context.currentTime, 0.001);
  }

  public getFm(): number {
    return this.fm;
  }

  public setHarmonic = (id: string) => (value: number) => {
    const index = parseInt(id, 10);
    this.imag[index] = value;
    this.setPeriodicWave();
  }

  public inputCvFM(): GainNode {
    return this.cvFmNode;
  }

  public inputFrequency(): AudioParam {
    return this.oscillator.frequency;
  }

  public output(): GainNode {
    return this.boost;
  }

  private calculateFrequency(freq: number): number {
    const octave = Math.floor(freq);
    const frequency = freq % 1;

    return ((16.35 + (16.35 * frequency)) * (2 ** octave));
  }

  private setDefaultValues() {
    this.setFrequency(this.frequency);
  }

  private setPeriodicWave() {
    this.wave = new PeriodicWave(this.context, {
      disableNormalization : false,
      imag : this.imag,
      real : this.real,
    });
    this.oscillator.setPeriodicWave(this.wave);
  }

  private createOscillator() {
    this.real = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.imag = new Float32Array([0.5, 0, 0, 0, 0, 0, 0, 0, 0]);
    this.oscillator = createOscillatorNode(this.context, 'sine', 0);
    this.setPeriodicWave();
  }

  private createGainNodes() {
    this.boost = createGainNode(this.context, 1);
    this.cvFmNode = createGainNode(this.context, 1);
  }

  private connectNodes() {
    this.cvFmNode.connect(this.oscillator.frequency);
    this.oscillator.connect(this.boost);
  }
}
