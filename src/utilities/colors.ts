import { Colors } from 'src/constants';

let subtractName = (name: string): string => {
  const result = name.replace(/[A-Z]/g, (match: string, index: number) => {
    if (index === 0) {
      return match.toLowerCase()
    }
    return `-${match.toLowerCase()}`
  })
  return `--${result}`
}

export const setCssColors = () => {
  const cssRoot: HTMLElement = document.querySelector(':root')
  Object.entries(Colors).forEach(([name, code]) => {
    const propName = subtractName(name)
    cssRoot.style.setProperty(propName, <string>code)
  })
}