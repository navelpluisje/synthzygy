import { NoiseTypes } from '@constants/enums';
import { NoiseNode } from '@nodes/noiseNode';

export class NoisesNode {
  private context: AudioContext;

  private pink: NoiseNode;
  private white: NoiseNode;
  private blue: NoiseNode;

  constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.pink = new NoiseNode(this.context, NoiseTypes.Pink);
    this.white = new NoiseNode(this.context, NoiseTypes.White);
    this.blue = new NoiseNode(this.context, NoiseTypes.Blue);
  }

  public async setup(): Promise<boolean> {
    await this.pink.setup();
    await this.white.setup();
    await this.blue.setup();
    return true;
  }

  public setPinkNoiseGain = (gain: number): void => {
    this.pink.setNoiseGain(gain);
  }

  public getPinkNoiseGain = (): number => {
    return this.pink.getNoiseGain();
  }

  public setWhiteNoiseGain = (gain: number): void => {
    this.white.setNoiseGain(gain);
  }

  public getWhiteNoiseGain = (): number => {
    return this.white.getNoiseGain();
  }

  public setBlueNoiseGain = (gain: number): void => {
    this.blue.setNoiseGain(gain);
  }

  public getBlueNoiseGain = (): number => {
    return this.blue.getNoiseGain();
  }

  public outputPinkNoise(): GainNode {
    return this.pink.outputNoise();
  }

  public outputWhiteNoise(): GainNode {
    return this.white.outputNoise();
  }

  public outputBlueNoise(): GainNode {
    return this.blue.outputNoise();
  }
}
