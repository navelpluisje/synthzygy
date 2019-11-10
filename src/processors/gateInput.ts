// gateInput.js
export class GateInputProcessor extends AudioWorkletProcessor {
  public up: boolean;
  public value: number;

  constructor() {
    super();
    this.up = false;
  }

  public process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const input = inputs[0]; // We only have and accept one output
    const output = outputs[0]; // We only have and accept one output

    input.forEach((channel, channelId) => {
      for (let i = 0; i < channel.length; i += 1) {
        if (this.up && channel[i] < 0.5) {
          this.up = false;
        } else if (!this.up && channel[i] > 0.8) {
          this.up = true;
        }

        output[channelId][i] = Number(this.up);
      }
    });
    return true;
  }
}
