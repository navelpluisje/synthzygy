
// white-noise-processor.js
class CvInput extends AudioWorkletProcessor {
  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors() {
    return [{
      name: 'amount',
      defaultValue: 0,
      minValue: 0,
      maxValue: 1,
    }, {
      name: 'value',
      defaultValue: 0,
    }];
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, AudioParam>) {
    const output = outputs[0]
    console.log(parameters)
    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        // @ts-ignore
        // const amountParam = parameters.get('amount') || parameters.amount
        const amountParam = parameters.amount
        // @ts-ignore
        // const valueParam = parameters.get('amount') || parameters.amount
        const valueParam = parameters.value
        console.log({
          amountParam,
          valueParam,
        })
        const amount: number =
          amountParam.length > 1
            ? amountParam[i]
            : amountParam[0]
        const value: number =
          valueParam.length > 1
            ? valueParam[i]
            : valueParam[0]

        channel[i] = amount * value
      }
    })
    return true
  }
}

registerProcessor('cv-input-processor', CvInput)
