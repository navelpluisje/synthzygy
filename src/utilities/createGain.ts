export const createGainNode = (context: AudioContext, value: number = 1): GainNode => {
  const gain = context.createGain()
  gain.gain.setValueAtTime(value, context.currentTime)

  return gain
}
