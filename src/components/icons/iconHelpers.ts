export const splitIcon = (icon: string): string[] => icon.toLowerCase().split('-')

export const setIconStyle = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgba(254, 254, 254, .4)'
  ctx.strokeStyle = 'rgba(0, 0, 0, .6)'
  ctx.lineWidth = 1
}

export const setPositionAndSize = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
) => {
  ctx.translate(x, y)
  ctx.scale(scale, scale)
}

export const setArrowStyle = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgba(0, 0, 0, .6)';
}

export const drawCircle = (ctx: CanvasRenderingContext2D) => {
  ctx.arc(0, 0, 13, 0, 2 * Math.PI)
  ctx.fill()
}
