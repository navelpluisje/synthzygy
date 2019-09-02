export class CvOutputProcessor extends AudioWorkletProcessor {
  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [{
      name: 'value',
      defaultValue: 0,
    }];
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const output = outputs[0]

    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        const valueParam = parameters.value
        const value: number =
          valueParam.length > 1
            ? valueParam[i]
            : valueParam[0]
        channel[i] = value
      }
    })
    return true
  }
}