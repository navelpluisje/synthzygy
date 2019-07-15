
export const roundByStepSize = (number: number, step: number) => (
  Number((Math.round(number / step) * step).toFixed(2))
)