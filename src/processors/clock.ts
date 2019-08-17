
// white-noise-processor.js
declare const sampleRate: number

export class ClockProcessor extends AudioWorkletProcessor {
  count: number
  value: number

  static get parameterDescriptors() {
    return [{
      name: 'pulseWidth',
      defaultValue: 0.5,
      minValue: 0,
      maxValue: 1,
    }, {
      name: 'frequency',
      defaultValue: 10,
      minValue: 0,
      maxValue: 100,
    }];
  }

  constructor() {
    super()
    this.count = 0;
    this.value = 0
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, AudioParam>) {
    const output = outputs[0] // We only have and accept one output
    // @ts-ignore
    const width = parameters.pulseWidth.length === 1
    // @ts-ignore
    const freq = parameters.frequency.length === 1

    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i += 1) {
        this.count += 1
        // @ts-ignore
        const waveLength = sampleRate / parameters.frequency[freq ? 0 : i]
        // @ts-ignore
        const out = this.count < (waveLength * parameters.pulseWidth[width ? 0 : i]) ? 1 : 0
        if (out !== this.value) {
          this.port.postMessage({ value: this.value })
          this.value = out
        }
        if (this.count === waveLength) {
          this.count = 0
        }
        channel[i] = out
      }
    })
    return true
  }
}
