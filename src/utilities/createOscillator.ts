export const createOscillatorNode = (
  context: AudioContext,
  type: OscillatorType,
  frequency: number = 0,
): OscillatorNode => {
  const oscillatorNode = new OscillatorNode(context, {
    type,
    frequency,
  })
  oscillatorNode.start()

  return oscillatorNode
}
