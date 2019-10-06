export const createConstantSourceNode = (
  context: AudioContext,
  value: number = 0,
): ConstantSourceNode => {
  const constantSource = context.createConstantSource()
  constantSource.offset.setValueAtTime(value, context.currentTime)
  constantSource.start()

  return constantSource
}
