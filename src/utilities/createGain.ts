export const createGainNode = (
  context: AudioContext,
  gain: number = 1,
): GainNode => {
  const gainNode = new GainNode(context, {
    gain,
  });

  return gainNode;
};
