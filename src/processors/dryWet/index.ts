
export class DryWet extends AudioWorkletProcessor {
  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [{
      name: 'value',
      defaultValue: 0,
      minValue: 0,
      maxValue: 1,
    }];
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, AudioParam>) {
    const output = outputs[0]
    if (inputs.length === 2) {
      const inputA = inputs[0]
      const inputB = inputs[1]

      output.forEach((channel, index) => {
        for (let i = 0; i < channel.length; i++) {
          // @ts-ignore
          const paramValue = parameters.value
          const valueParam:number = paramValue.length > 1
          ? paramValue[i]
          : paramValue[0]
          // const value: number =
          let valA = 1 - valueParam
          let valB = valueParam

          channel[i] = inputA[index][i] * valA + inputB[index][i] + valB
        }
      })
    }
    return true
  }
}
