import { NoiseTypes } from '@constants/enums';
import { createGainNode } from '@utilities/createGain';

export class NoiseNode {
  private gain: number;
  private context: AudioContext;
  private noiseType: NoiseTypes;
  private noiseBuffer: AudioBuffer;
  private noiseNode: AudioBufferSourceNode;
  private noise: GainNode;

  constructor(
    context: AudioContext,
    type: NoiseTypes,
  ) {
    this.context = context;
    this.noiseType = type;
  }

  public async setup(): Promise<boolean> {
    await this.createNoiseNode();
    await this.createGainNode();
    await this.connectNodes();
    return true;
  }

  public setNoiseGain = (gain: number): void => {
    this.gain = gain;
    this.noise.gain.setTargetAtTime(gain, this.context.currentTime, 0.001);
  }

  public getNoiseGain = (): number => {
    return this.gain;
  }

  public outputNoise(): GainNode {
    return this.noise;
  }

  private async getNoise(type: NoiseTypes): Promise<AudioBuffer> {
    let soundSource: AudioBuffer;
    let noiseData: ArrayBuffer;
    const response = await fetch(`/assets/audio/${type}noise.mp3`);
    try {
      noiseData = await response.arrayBuffer();
    } catch (e) {
      console.error('could not get data for convolver', e);
    }
    await this.context.decodeAudioData(noiseData, (buffer) => {
      soundSource = buffer;
    });

    return soundSource;
  }

  private async createNoiseNode(): Promise<boolean> {
    this.noiseBuffer = await this.getNoise(this.noiseType);

    this.noiseNode = new AudioBufferSourceNode(this.context, {
      buffer: this.noiseBuffer,
      loop: true,
    });
    this.noiseNode.start(0);

    return true;
  }

  private async createGainNode() {
    this.noise = createGainNode(this.context, 2.5);
  }

  private async connectNodes() {
    this.noiseNode.connect(this.noise);
  }
}
