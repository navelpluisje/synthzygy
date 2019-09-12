export const toKebabCase = (value: string) => {
  const result = value.replace(/[A-Z]/g, (match: string, index: number) => {
    if (index === 0) {
      return match.toLowerCase()
    }
    return `-${match.toLowerCase()}`
  })
  return `--${result}`

}