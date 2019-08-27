
export class BitCrusherProcessor extends AudioWorkletProcessor {
  _phase: number = 0
  _lastSampleValue: number

  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors () {
    return [{
      name: 'bitDepth',
      defaultValue: 12,
      minValue: 1,
      maxValue: 16
    }, {
      name: 'frequencyReduction',
      defaultValue: 0.5,
      minValue: 0,
      maxValue: 1
    }]
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const input = inputs[0]
    const output = outputs[0]
    const bitDepth = parameters.bitDepth
    const frequencyReduction = parameters.frequencyReduction

    if (bitDepth.length > 1) {
      // The bitDepth parameter array has 128 sample values.
      output.forEach((channel, channelId) => {
        channel.forEach((channelStep, stepId) => {
          let step = Math.pow(0.5, bitDepth[stepId])
          // Use modulo for indexing to handle the case where
          // the length of the frequencyReduction array is 1.
          this._phase += frequencyReduction[stepId % frequencyReduction.length]
          if (this._phase >= 1.0) {
            this._phase -= 1.0
            this._lastSampleValue = step * Math.floor(input[channelId][stepId] / step + 0.5)
          }
          channelStep = this._lastSampleValue
        })
      })
    } else {
      // Because we know bitDepth is constant for this call,
      // we can lift the computation of step outside the loop,
      // saving many operations.
      const step = Math.pow(0.5, bitDepth[0])
      output.forEach((channel, channelId) => {
        channel.forEach((channelStep, stepId) => {
          this._phase += frequencyReduction[(stepId % frequencyReduction.length) || 0]
          if (this._phase >= 1.0) {
            this._phase -= 1.0
            this._lastSampleValue = step * Math.floor(input[channelId][stepId] / step + 0.5)
          }
          channelStep = this._lastSampleValue
        })
      })
    }
    return true
  }
}