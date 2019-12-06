declare const sampleRate: number;

export class ClockProcessor extends AudioWorkletProcessor {
  public power: number[];
  public count: number[];
  public value: number[];

  static get parameterDescriptors() {
    return [{
      defaultValue: 0.5,
      maxValue: 1,
      minValue: 0,
      name: 'pulseWidth',
    }, {
      defaultValue: 10,
      maxValue: 100,
      minValue: 0,
      name: 'frequency',
    }];
  }

  constructor() {
    super();
    this.power = [3, 2, 1, 0, .5];
    this.count = [0, 0, 0, 0, 0];
    this.value = [0, 0, 0, 0, 0];
  }

  public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    // const output = outputs[0]; // We only have and accept one output
    const pulseWidth = parameters.pulseWidth;
    const frequency = parameters.frequency;
    const singlePulseWidth = pulseWidth.length === 1;
    const singleFrequency = frequency.length === 1;

    outputs.forEach((output, index) => {
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i += 1) {
          this.count[index] += 1;
          const waveLength = (sampleRate / frequency[singleFrequency ? 0 : i]) * (2 ** this.power[index]);
          const out = this.count[index] < (waveLength * pulseWidth[singlePulseWidth ? 0 : i]) ? 1 : 0;

          if (out !== this.value[index]) {
            this.value[index] = out;
          }
          if (this.count[index] >= waveLength) {
            this.count[index] = 0;
          }
          channel[i] = out;
        }
      });
    });
    return true;
  }
}
