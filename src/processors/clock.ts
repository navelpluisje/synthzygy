
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
    this.count = 0
    this.value = 0
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const output = outputs[0] // We only have and accept one output
    const pulseWidth = parameters.pulseWidth
    const frequency = parameters.frequency
    const singlePulseWidth = pulseWidth.length === 1
    const singleFrequency = frequency.length === 1

    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i += 1) {
        this.count += 1
        const waveLength = sampleRate / frequency[singleFrequency ? 0 : i]
        const out = this.count < (waveLength * pulseWidth[singlePulseWidth ? 0 : i]) ? 1 : 0

        if (out !== this.value) {
          this.value = out
          this.port.postMessage({ value: this.value })
        }
        if (this.count >= waveLength) {
          this.count = 0
        }
        channel[i] = out
      }
    })
    return true
  }
}
