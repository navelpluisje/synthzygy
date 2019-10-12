export const createOscillatorNode = (
  context: AudioContext,
  type: OscillatorType,
  frequency: number = 0,
): OscillatorNode => {
  const oscillatorNode = new OscillatorNode(context, {
    frequency,
    type,
  });
  oscillatorNode.start();

  return oscillatorNode;
};
