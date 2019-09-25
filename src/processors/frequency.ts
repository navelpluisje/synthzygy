import { drawFmIcon } from './../components/icons/fmIcon';
export class FrequencyProcessor extends AudioWorkletProcessor {
  // Custom AudioParams can be defined with this static getter.
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [{
      name: 'frequency',
      defaultValue: 3,
      minValue: 0,
      maxValue: 12,
    }, {
      name: 'octave',
      defaultValue: 3,
      minValue: 0,
      maxValue: 8,
    }, {
      name: 'range',
      defaultValue: 1,
      minValue: 0,
      maxValue: 1,
    }, {
      name: 'fm',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
    }];
  }

  getFrequency(range: number, oct: number, freq: number): number {
    const octave = range === 1 ? Math.floor(freq) : oct
    const frequency = range === 1 ? freq % 1 : freq / 10

    return ((16.35 + (16.35 * frequency)) * (2 ** octave))
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const output = outputs[0]
    const input = inputs[0][0]

    const fm = parameters.fm
    const singleFm = fm.length === 1
    const range = parameters.range
    const singleRange = range.length === 1
    const octave = parameters.octave
    const singleOctave = octave.length === 1
    const frequency = parameters.frequency
    const singleFrequency = frequency.length === 1

    output.forEach((channel, index) => {
      for (let i = 0; i < channel.length; i++) {
        const fmValue = fm[singleFm ? 0 : i]

        if (input.length > 0) {
          channel[i] = this.getFrequency(
            1,
            0,
            input[i] + fmValue
          )
          continue
        } else {
          channel[i] = this.getFrequency(
            range[singleRange ? 0 : i],
            octave[singleOctave ? 0 : i],
            frequency[singleFrequency ? 0 : i] + fmValue
          )
          continue
        }
      }
    })
    return true
  }
}