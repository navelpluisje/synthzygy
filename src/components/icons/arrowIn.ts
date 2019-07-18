import { setArrowStyle, setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "src/constants";

export const drawArrowInIcon = (ctx: CanvasRenderingContext2D, position: PositionType) => {
  const {x, y} = position
  ctx.save()
  setArrowStyle(ctx)
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  ctx.beginPath()
  ctx.moveTo(-12, -5);
  ctx.lineTo(-8, 0);
  ctx.lineTo(-12, 5);
  ctx.lineTo(-13, 0);
  ctx.fill();
  ctx.fillStyle = 'rgba(254, 254, 254, .4)';
  ctx.closePath();  ctx.restore()
}
