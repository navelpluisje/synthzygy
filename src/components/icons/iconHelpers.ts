/**
 * An icon name can be build out of multiple parts.
 * The name will split by the seperator character
 * @param icon The iconname to split
 */
export const splitIcon = (icon: string): string[] => icon.toLowerCase().split('-')

/**
 * Get the styling used for icons
 * @param ctx The canvas context to set the values to
 */
export const setIconStyle = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgba(254, 254, 254, .4)'
  ctx.strokeStyle = 'rgba(0, 0, 0, .6)'
  ctx.lineWidth = 1
}

/**
 * Sets the scale and start position in the context
 * @param ctx The canvas context to set the values to
 * @param x The vertical offset
 * @param y The horizontal offset
 * @param scale The amount of resizing done
 */
export const setPositionAndSize = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
) => {
  ctx.translate(x, y)
  ctx.scale(scale, scale)
}

/**
 * Sets the styling used for the arrows in the icons
 * @param ctx The canvas context to set the value to
 */
export const setArrowStyle = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgba(0, 0, 0, .6)';
}

/**
 * Create the cricle where the icon is set into
 * @param ctx The canvas context to draw the icon -circle to
 */
export const drawCircle = (ctx: CanvasRenderingContext2D) => {
  ctx.arc(0, 0, 13, 0, 2 * Math.PI)
  ctx.fill()
}
