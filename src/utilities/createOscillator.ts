export const createOscillatorNode = (
  context: AudioContext,
  type: OscillatorType,
  frequency: number = 0,
): OscillatorNode => {
  const oscillator = context.createOscillator()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, context.currentTime)
  oscillator.start()

  return oscillator
}
