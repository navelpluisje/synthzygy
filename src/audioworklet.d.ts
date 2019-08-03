// Audio stuff missing in typescript

interface AudioWorkletProcessor {
  readonly port: MessagePort
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Map<string, AudioParam>): void
}

declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor
  new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor
}

type AConstructorTypeOf<T> = new (...args:any[]) => T;

declare var registerProcessor: (name: string, processorCtor: AConstructorTypeOf<AudioWorkletProcessor>) => void;

