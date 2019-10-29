export class BitCrusherProcessor extends AudioWorkletProcessor {
  public phase: number = 0;
  public lastSampleValue: number;

  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [{
      defaultValue: 8,
      maxValue: 16,
      minValue: 1,
      name: 'bitDepth',
    }, {
      defaultValue: 0.5,
      maxValue: 1,
      minValue: 0,
      name: 'frequencyReduction',
    }];
  }

  public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const input = inputs[0];
    const output = outputs[0];
    const bitDepth = parameters.bitDepth;
    const frequencyReduction = parameters.frequencyReduction;

    if (bitDepth.length > 1) {
      // The bitDepth parameter array has 128 sample values.
      for (let channel = 0; channel < output.length; ++channel) {
        for (let i = 0; i < output[channel].length; ++i) {
          const step = Math.pow(0.5, bitDepth[i]);
          // Use modulo for indexing to handle the case where
          // the length of the frequencyReduction array is 1.
          this.phase += frequencyReduction[i % frequencyReduction.length];
          if (this.phase >= 1.0) {
            this.phase -= 1.0;
            this.lastSampleValue = step * Math.floor(input[channel][i] / step + 0.5);
          }
          output[channel][i] = this.lastSampleValue;
        }
      }
    } else {
      // Because we know bitDepth is constant for this call,
      // we can lift the computation of step outside the loop,
      // saving many operations.
      const step = Math.pow(0.5, bitDepth[0]);
      for (let channel = 0; channel < output.length; ++channel) {
          for (let i = 0; i < output[channel].length; ++i) {
            this.phase += frequencyReduction[i % frequencyReduction.length];
            if (this.phase >= 1.0) {
            this.phase -= 1.0;
            this.lastSampleValue = step * Math.floor(input[channel][i] / step + 0.5);
          }
            output[channel][i] = this.lastSampleValue;
        }
      }
    }
    // No need to return a value; this node’s lifetime is dependent only on its
    // input connections.
    return true;
  }
}
