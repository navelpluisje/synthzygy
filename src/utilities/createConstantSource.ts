export const createConstantSourceNode = (
  context: AudioContext,
  offset: number = 0,
): ConstantSourceNode => {
  const constantSourceNode = new ConstantSourceNode(context, {
    offset,
  })
  constantSourceNode.start()

  return constantSourceNode
}
